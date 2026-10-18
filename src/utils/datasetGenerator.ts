/**
 * High-performance Insurance Claims Data Generator
 * Generates benchmark dataset matching the standard 58,592 rows x 41 columns schema
 * for auto insurance claim predictions.
 */

import Papa from 'papaparse';

export const AREA_CLUSTERS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9', 'C10', 'C11', 'C12', 'C13', 'C14'];
export const SEGMENTS = ['A', 'B1', 'B2', 'C1', 'C2', 'Utility'];
export const MODELS = ['M1', 'M2', 'M3', 'M4', 'M5', 'M6', 'M7', 'M8', 'M9', 'M10', 'M11'];
export const FUEL_TYPES = ['CNG', 'Petrol', 'Diesel'];
export const ENGINE_TYPES = ['F8D Petrol Engine', '1.2 L K Series Engine', '1.5 L U2 CRDi', '1.0 L Turbo GDi', '1.2 L K12N DualJet'];
export const STEERING_TYPES = ['Power', 'Manual', 'Electric'];

export function generateBenchmarkInsuranceData(rowCount: number = 58592): Record<string, any>[] {
  const records: Record<string, any>[] = [];
  
  // Seeded deterministic pseudorandom generator for consistent statistical behavior
  let seed = 42;
  function random(): number {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  }

  function pick<T>(arr: T[]): T {
    return arr[Math.floor(random() * arr.length)];
  }

  function randomRange(min: number, max: number, decimals: number = 2): number {
    const val = min + random() * (max - min);
    return Number(val.toFixed(decimals));
  }

  function randomChoice(probTrue: number): 'Yes' | 'No' {
    return random() < probTrue ? 'Yes' : 'No';
  }

  for (let i = 1; i <= rowCount; i++) {
    const policyId = `ID${String(i).padStart(6, '0')}`;
    const policyTenure = randomRange(0.001, 1.396, 3);
    const ageOfCar = randomRange(0.0, 0.15, 2);
    const ageOfPolicyholder = randomRange(0.28, 0.90, 2);
    const areaCluster = pick(AREA_CLUSTERS);
    const populationDensity = Math.floor(randomRange(2000, 73400, 0));
    const make = Math.floor(randomRange(1, 5, 0));
    const segment = pick(SEGMENTS);
    const model = pick(MODELS);
    const fuelType = pick(FUEL_TYPES);
    const engineType = pick(ENGINE_TYPES);
    const airbags = pick([1, 2, 6]);
    const ncapRating = pick([0, 1, 2, 3, 4, 5]);

    const isEsc = randomChoice(0.35);
    const isAdjustableSteering = randomChoice(0.60);
    const isTpms = randomChoice(0.25);
    const isParkingSensors = randomChoice(0.90);
    const isSpeedAlert = randomChoice(0.98);
    const isDoorLockOption = randomChoice(0.85);
    const isCentralLocking = randomChoice(0.88);
    const isPowerSteering = randomChoice(0.95);
    const isDriverSeatHeightAdjustable = randomChoice(0.55);
    const isDayNightRearViewMirror = randomChoice(0.40);
    const isEcw = randomChoice(0.30);
    const isRearWindowWiper = randomChoice(0.35);
    const isRearWindowWasher = randomChoice(0.35);
    const isRearWindowDefogger = randomChoice(0.40);
    const isBrakeAssist = randomChoice(0.50);
    const isPowerDoorLocks = randomChoice(0.88);
    const isSensor = randomChoice(0.92);
    const isRearCamera = randomChoice(0.38);

    const maxTorque = pick(['60Nm@3500rpm', '113Nm@4400rpm', '250Nm@1500rpm', '170Nm@1750rpm', '821Nm@2000rpm']);
    const maxPower = pick(['40bhp@5500rpm', '88bhp@6000rpm', '113bhp@4000rpm', '98bhp@6000rpm']);

    const length = Math.floor(randomRange(3445, 4300, 0));
    const width = Math.floor(randomRange(1515, 1790, 0));
    const height = Math.floor(randomRange(1475, 1825, 0));
    const grossWeight = Math.floor(randomRange(1185, 1720, 0));
    const steeringType = pick(STEERING_TYPES);
    const turningRadius = randomRange(4.5, 5.2, 1);

    // Calculate realistic claim risk score based on statistical risk factors
    let riskLogits = -2.7; // Base claim rate ~6.5%
    if (ageOfPolicyholder < 0.35) riskLogits += 0.35; // Younger drivers higher risk
    if (ageOfCar > 0.10) riskLogits += 0.30; // Older cars higher claim rate
    if (populationDensity > 40000) riskLogits += 0.40; // High urban density higher claim rate
    if (isEsc === 'No') riskLogits += 0.18;
    if (isBrakeAssist === 'No') riskLogits += 0.15;
    if (ncapRating < 2) riskLogits += 0.22;
    if (policyTenure < 0.2) riskLogits += 0.28;

    const probClaim = 1 / (1 + Math.exp(-riskLogits));
    const claimStatus = random() < probClaim ? 1 : 0;

    records.push({
      policy_id: policyId,
      policy_tenure: policyTenure,
      age_of_car: ageOfCar,
      age_of_policyholder: ageOfPolicyholder,
      area_cluster: areaCluster,
      population_density: populationDensity,
      make: make,
      segment: segment,
      model: model,
      fuel_type: fuelType,
      max_torque: maxTorque,
      max_power: maxPower,
      engine_type: engineType,
      airbags: airbags,
      is_esc: isEsc,
      is_adjustable_steering: isAdjustableSteering,
      is_tpms: isTpms,
      is_parking_sensors: isParkingSensors,
      is_speed_alert: isSpeedAlert,
      is_door_lock_option: isDoorLockOption,
      is_central_locking: isCentralLocking,
      is_power_steering: isPowerSteering,
      is_driver_seat_height_adjustable: isDriverSeatHeightAdjustable,
      is_day_night_rear_view_mirror: isDayNightRearViewMirror,
      is_ecw: isEcw,
      is_rear_window_wiper: isRearWindowWiper,
      is_rear_window_washer: isRearWindowWasher,
      is_rear_window_defogger: isRearWindowDefogger,
      is_brake_assist: isBrakeAssist,
      is_power_door_locks: isPowerDoorLocks,
      is_sensor: isSensor,
      is_rear_camera: isRearCamera,
      ncap_rating: ncapRating,
      length: length,
      width: width,
      height: height,
      gross_weight: grossWeight,
      steering_type: steeringType,
      turning_radius: turningRadius,
      claim_status: claimStatus
    });
  }

  return records;
}

export function convertToCSV(records: Record<string, any>[]): string {
  return Papa.unparse(records);
}
