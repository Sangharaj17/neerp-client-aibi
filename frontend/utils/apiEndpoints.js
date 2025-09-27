import { Component } from "lucide-react";

const API_BASE = "/api";

//To use this in other files
// import { API_ENDPOINTS } from "@/utils/apiEndpoints";
//API_ENDPOINTS.OPERATOR

export const API_ENDPOINTS = {
  OPERATOR: `${API_BASE}/operator-elevator`,//manual,automatic
  TYPE_OF_LIFT: `${API_BASE}/type-of-lift`, //geared,gearless
  MACHINE_ROOMS: `${API_BASE}/machine-rooms`,//machine room,machine room less

  UNIT: `${API_BASE}/unit`,
  CAPACITY_TYPES: `${API_BASE}/capacityTypes`,
  PERSON_CAPACITY: `${API_BASE}/personCapacity`,
  WEIGHTS: `${API_BASE}/weights`,

  SPEED: `${API_BASE}/speeds`,

  FLOORS: `${API_BASE}/floors`,
  ADDITIONAL_FLOORS: `${API_BASE}/additional-floors`,

  CABIN_TYPE: `${API_BASE}/cabinType`,
  CABIN_SUBTYPE: `${API_BASE}/cabinSubType`,

  LIGHT_FITTINGS: `${API_BASE}/light-fittings`,
  CABIN_FLOORING: `${API_BASE}/cabin-flooring`,
  CABIN_CEILING: `${API_BASE}/cabin-ceiling`,

  AIR_TYPE: `${API_BASE}/air-type`,
  AIR_SYSTEM: `${API_BASE}/air-system`,

  LANDING_DOOR_TYPE: `${API_BASE}/landing-door-type`,
  LANDING_DOOR_SUBTYPE: `${API_BASE}/landing-door-subType`,

  CAR_DOOR_TYPE: `${API_BASE}/car-door-types`,
  CAR_DOOR_SUBTYPE: `${API_BASE}/car-door-subTypes`,

  CONTROL_PANEL: `${API_BASE}/control-panel-types`,
  HARNESS: `${API_BASE}/harness`,

  COUNTER_FRAME_TYPES: `${API_BASE}/counter-frame-types`,

  GUIDE_RAIL_TYPE: `${API_BASE}/counter-weights-types`,
  GUIDE_RAIL: `${API_BASE}/counter-weights`,

  NEW_COUNTER_WEIGHTS: `${API_BASE}/new-counter-weights`,//(tbl_new_counter_weight)

  BRACKETS_TYPES: `${API_BASE}/bracket-types`,
  BRACKETS: `${API_BASE}/brackets`,

  WIRE_ROPE: `${API_BASE}/wire-ropes`,
  WIRE_ROPE_TYPES: `${API_BASE}/wire-rope-types`,
  GOVERNOR_ROPES: `${API_BASE}/governor-ropes`,

  LOP_TYPE: `${API_BASE}/lop-type`,
  LOP_SUBTYPE: `${API_BASE}/lop-sub-type`,

  COP_TYPE: `${API_BASE}/cops`,

  LANDING_DOOR_TYPE: `${API_BASE}/landing-door-type`,
  LANDING_DOOR_SUBTYPE: `${API_BASE}/landing-door-subType`,

  OTHER_MATERIAL: `${API_BASE}/other-material`,  
  ARD_DEVICE: `${API_BASE}/ardDevice`,

  COMPONENT : `${API_BASE}/components`,
  MANUFACTURER : `${API_BASE}/manufactures`,
  WARRANTY : `${API_BASE}/warranties`,
  FEATURES : `${API_BASE}/features`,
  OPERATION_TYPE : `${API_BASE}/operationType`,
  CAPACITY_DIMENSIONS : `${API_BASE}/capacity-dimensions`,

  FASTENERS : `${API_BASE}/fasteners`,
};
