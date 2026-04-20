'use server';

import crypto from 'crypto'
import { cookies, headers } from 'next/headers'

import { createClient } from '@/utils/supabase/server'

const VISITOR_COOKIE = 'ae_visitor_id';
const VISITOR_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const DEFAULT_OWNER_LATITUDE = 30.0444
const DEFAULT_OWNER_LONGITUDE = 31.2357

type VisitorContext = {
  deviceType: string
  browserName: string
  browserVersion: string | null
  osName: string
  osVersion: string | null
  country: string | null
  countryCode: string | null
  region: string | null
  city: string | null
  timezone: string | null
  latitude: number | null
  longitude: number | null
  distanceKm: number | null
}

function parseCoordinate(value: string | null | undefined) {
  if (!value) return null
  const parsed = Number.parseFloat(value)
  return Number.isFinite(parsed) ? parsed : null
}

function normalizeVersion(version: string | null) {
  return version ? version.replaceAll('_', '.') : null
}

function getDeviceType(userAgent: string) {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return 'Tablet'
  if (/android/i.test(userAgent)) return /mobile/i.test(userAgent) ? 'Mobile' : 'Tablet'
  if (/mobi|iphone|ipod|windows phone/i.test(userAgent)) return 'Mobile'
  return 'Desktop'
}

function getBrowserInfo(userAgent: string) {
  const patterns: Array<{ name: string; regex: RegExp }> = [
    { name: 'Edge', regex: /Edg\/([\d.]+)/i },
    { name: 'Opera', regex: /OPR\/([\d.]+)/i },
    { name: 'Samsung Internet', regex: /SamsungBrowser\/([\d.]+)/i },
    { name: 'Firefox', regex: /Firefox\/([\d.]+)/i },
    { name: 'Chrome', regex: /(?:Chrome|CriOS)\/([\d.]+)/i },
    { name: 'Safari', regex: /Version\/([\d.]+).*Safari/i },
  ]

  for (const pattern of patterns) {
    const match = userAgent.match(pattern.regex)
    if (match?.[1]) {
      return { name: pattern.name, version: match[1] }
    }
  }

  return { name: 'Unknown', version: null }
}

function getOsInfo(userAgent: string) {
  const patterns: Array<{ name: string; regex: RegExp }> = [
    { name: 'Windows', regex: /Windows NT ([\d.]+)/i },
    { name: 'Android', regex: /Android ([\d.]+)/i },
    { name: 'iOS', regex: /(?:iPhone|CPU iPhone OS|CPU OS|iPad).*OS ([\d_]+)/i },
    { name: 'macOS', regex: /Mac OS X ([\d_]+)/i },
    { name: 'Linux', regex: /Linux/i },
  ]

  for (const pattern of patterns) {
    const match = userAgent.match(pattern.regex)
    if (pattern.name === 'Linux' && match) {
      return { name: 'Linux', version: null }
    }
    if (match?.[1]) {
      return { name: pattern.name, version: normalizeVersion(match[1]) }
    }
  }

  return { name: 'Unknown', version: null }
}

function haversineDistanceKm(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number,
) {
  const earthRadiusKm = 6371
  const deltaLatitude = ((endLatitude - startLatitude) * Math.PI) / 180
  const deltaLongitude = ((endLongitude - startLongitude) * Math.PI) / 180

  const a =
    Math.sin(deltaLatitude / 2) ** 2 +
    Math.cos((startLatitude * Math.PI) / 180) *
      Math.cos((endLatitude * Math.PI) / 180) *
      Math.sin(deltaLongitude / 2) ** 2

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

function getCountryName(countryCode: string | null) {
  if (!countryCode) return null

  try {
    const displayNames = new Intl.DisplayNames(['en'], { type: 'region' })
    return displayNames.of(countryCode.toUpperCase()) ?? countryCode.toUpperCase()
  } catch {
    return countryCode.toUpperCase()
  }
}

async function getVisitorContext(): Promise<VisitorContext> {
  const requestHeaders = await headers()
  const userAgent = requestHeaders.get('user-agent') ?? ''
  const countryCode = requestHeaders.get('x-vercel-ip-country')?.trim().toUpperCase() ?? null
  const region = requestHeaders.get('x-vercel-ip-country-region')?.trim() || null
  const city = requestHeaders.get('x-vercel-ip-city')?.trim() || null
  const timezone = requestHeaders.get('x-vercel-ip-timezone')?.trim() || null
  const latitude = parseCoordinate(requestHeaders.get('x-vercel-ip-latitude'))
  const longitude = parseCoordinate(requestHeaders.get('x-vercel-ip-longitude'))
  const deviceType = getDeviceType(userAgent)
  const browser = getBrowserInfo(userAgent)
  const os = getOsInfo(userAgent)

  const ownerLatitude = parseCoordinate(process.env.ANALYTICS_OWNER_LATITUDE) ?? DEFAULT_OWNER_LATITUDE
  const ownerLongitude = parseCoordinate(process.env.ANALYTICS_OWNER_LONGITUDE) ?? DEFAULT_OWNER_LONGITUDE
  const distanceKm =
    latitude !== null && longitude !== null
      ? Math.round(haversineDistanceKm(latitude, longitude, ownerLatitude, ownerLongitude) * 10) / 10
      : null

  return {
    deviceType,
    browserName: browser.name,
    browserVersion: browser.version,
    osName: os.name,
    osVersion: os.version,
    country: getCountryName(countryCode),
    countryCode,
    region,
    city,
    timezone,
    latitude,
    longitude,
    distanceKm,
  }
}

export async function logPageView(pathname: string) {
  // Extract a slug if viewing an article or project (e.g. /en/projects/my-slug -> my-slug)
  const segments = pathname.split('/').filter(Boolean);
  let slug = null;
  if (segments.length >= 3 && (segments[1] === 'projects' || segments[1] === 'articles')) {
    slug = segments[2];
  }

  // Create or reuse a privacy-friendly anonymous visitor id.
  // This keeps the same visitor counted once across multiple visits from the same browser.
  const cookieStore = await cookies();
  const existingVisitorId = cookieStore.get(VISITOR_COOKIE)?.value;
  const visitorId = existingVisitorId || crypto.randomUUID();

  if (!existingVisitorId) {
    cookieStore.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: VISITOR_COOKIE_MAX_AGE,
    });
  }

  const supabase = await createClient();
  const visitorContext = await getVisitorContext()

  const { error } = await supabase
    .from('page_views')
    .insert([
      {
        path: pathname,
        slug,
        visitor_id: visitorId,
        device_type: visitorContext.deviceType,
        browser_name: visitorContext.browserName,
        browser_version: visitorContext.browserVersion,
        os_name: visitorContext.osName,
        os_version: visitorContext.osVersion,
        country: visitorContext.country,
        country_code: visitorContext.countryCode,
        region: visitorContext.region,
        city: visitorContext.city,
        timezone: visitorContext.timezone,
        latitude: visitorContext.latitude,
        longitude: visitorContext.longitude,
        distance_km: visitorContext.distanceKm,
      }
    ]);

  if (error) {
    console.error('Failed to log page view:', error);
  }
}
