// Pathing
// _______
// src/api/endpoints/featureFlags.js

import { client } from '@/api/client.js'

export function getFeatureFlags() {
  return client('/features')
}
