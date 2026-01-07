-- ============================================
-- PostgreSQL INSERT STATEMENTS ONLY
-- Generated: 2025-12-22 11:44:49
-- Source: MySQL (nexasozi_NEeRP_v2)
-- Transformed: Column names mapped to PostgreSQL target schema
-- Table order: Sorted by FK dependencies (parent tables first)
-- NOTE: Tables must already exist in PostgreSQL
-- ============================================

BEGIN;

-- ============================================
-- MIGRATION INSERTS (Using ON CONFLICT DO NOTHING)
-- Preserves existing default data, only inserts new records
-- ============================================

-- ============================================
-- NEW PARENT TABLE INSERTS
-- ============================================

-- tbl_air_type

-- ============================================
-- TABLE INSERT STATEMENTS (Ordered by FK dependencies)
-- ============================================

-- tbl_air_type  - DONE
INSERT INTO tbl_air_type (id, name, status) VALUES (1, 'BLOWER', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_air_type (id, name, status) VALUES (2, 'FAN', true) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_air_type_id_seq', 2, true);

-- tbl_bracket_type - DONE
INSERT INTO tbl_bracket_type (id, name) VALUES (1, 'GP BRACKET') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_bracket_type (id, name) VALUES (2, 'COMBINATION BRACKET') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_bracket_type_id_seq', 1, true);

-- tbl_counter_weights_types - DONE
INSERT INTO tbl_counter_weights_types (id, name) VALUES (1, '16 MM & 10 MM') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weights_types (id, name) VALUES (2, '6 MM & 10 MM') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_counter_weights_types_id_seq', 2, true);

-- tbl_cabin_type - done
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (1, 'CABIN M.S POWDER COATED REGULAR') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (2, 'CABIN M.S P.C + S.S MIRROR(BACK SIDE)') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (3, 'CABIN M.S P.C CUSTOMSIED') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (5, 'CABIN M.S P.C + GLASS CAPSULE ') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (6, 'CABIN S.S HAIRLINE FINISH ') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (7, 'CABIN S.S MIRROR FINISH') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (8, 'CABIN S.S CUSTOMISED FINISH') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (9, 'CABIN S.S CAPSULE + BACK SIDE GLASS') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (10, 'CABIN S.S MAT FINISH ') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (11, 'CABIN GLASS CAPSULE') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (12, 'CABIN GLASS CAPSULE CUSTOMISED') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (13, 'CABIN S S Decorative') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cabin_type (id, cabintype) VALUES (14, 'CABIN S S Decorative Laminated Cabin') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_cabin_type_id_seq', 14, true);


-- tbl other material
INSERT INTO tbl_other_material (id, operator_type, other_material_display_name,
 other_material_name, price, capacity_type, person_capacity_id, weight_id, machine_room_id, quantity, 
 floors, quantity_unit, other_material_main_id) VALUES

(29, NULL, 'GEARED MACHINE UNIT 4 PASSENGER','GEARED MACHINE UNIT 4 PASSENGER', 69375, 1, 1, NULL, 1, '1', NULL, '', 4 ),
(30, NULL, 'GEARED MACHINE UNIT 6 PASSENGER','GEARED MACHINE UNIT 6 PASSENGER', 69375,1, 3, NULL, 1, '1', NULL, '', 4 ),
(31, NULL, 'GEARED MACHINE UNIT 8 PASSENGER','GEARED MACHINE UNIT 8 PASSENGER', 89375,1, 4, NULL, 1, '1', NULL, '', 4 ),
(32, NULL, 'GEARED MACHINE UNIT 10 PASSENGER','GEARED MACHINE UNIT 10 PASSENGER', 100625,1, 5, NULL, 1, '1', NULL, '', 4 ),
(33, NULL, 'GEARED MACHINE UNIT 13 PASSENGER','GEARED MACHINE UNIT 13 PASSENGER', 140625,1, 6, NULL, 1, '1', NULL, '', 4 ),
(34, NULL, 'GEARED MACHINE UNIT 15 PASSENGER','GEARED MACHINE UNIT 15 PASSENGER', 145625,1, 7, NULL, 1, '1', NULL, '', 4 ),
(35, NULL, 'GEARED MACHINE UNIT 20 PASSENGER','GEARED MACHINE UNIT 20 PASSENGER', 210625,1, 8, NULL, 1, '1', NULL, '', 4 ),
(36, NULL, 'GEARED MACHINE UNIT 25 PASSENGER','GEARED MACHINE UNIT 25 PASSENGER', 212500,1, 10, NULL, 1, '1', NULL, '', 4 ),
(37, NULL, 'GEARED MACHINE UNIT 30 PASSENGER','GEARED MACHINE UNIT 30 PASSENGER', 212500,1, 13, NULL, 1, '1', NULL, '', 4 ),
(38, NULL, 'GEARLESS MACHINE UNIT 4 PASSENGER','GEARLESS MACHINE UNIT 4 PASSENGER', 105000,1, 1, NULL, 2, '1', NULL, '', 4 ),
(39, NULL, 'GEARLESS MACHINE UNIT 6 PASSENGER','GEARLESS MACHINE UNIT 6 PASSENGER', 106250,1, 3, NULL, 2, '1', NULL, '', 4 ),
(40, NULL, 'GEARLESS MACHINE UNIT 8 PASSENGER','GEARLESS MACHINE UNIT 8 PASSENGER', 135000,1, 4, NULL, 2, '1', NULL, '', 4 ),
(41, NULL, 'GEARLESS MACHINE UNIT 10 PASSENGER','GEARLESS MACHINE UNIT 10 PASSENGER', 144550,1, 5, NULL, 2, '1', NULL, '', 4 ),
(42, NULL, 'GEARLESS MACHINE UNIT 13 PASSENGER','GEARLESS MACHINE UNIT 13 PASSENGER', 181250,1, 6, NULL, 2, '1', NULL, '', 4 ),
(43, NULL, 'GEARLESS MACHINE UNIT 15 PASSENGER','GEARLESS MACHINE UNIT 15 PASSENGER', 194375, 1,7, NULL, 2, '1', NULL, '', 4 ),
(44, NULL, 'GEARLESS MACHINE UNIT 20 PASSENGER', 'GEARLESS MACHINE UNIT 20 PASSENGER', 385000,1, 8, NULL, 2, '1', NULL, '', 4 ),
(45, NULL, 'GEARLESS MACHINE UNIT 25 PASSENGER', 'GEARLESS MACHINE UNIT 25 PASSENGER', 425000,1, 10, NULL, 2, '1', NULL, '', 4 ),
(46, NULL, 'GEARLESS MACHINE UNIT 30 PASSENGER','GEARLESS MACHINE UNIT 30 PASSENGER', 487500, 1,13, NULL, 2, '1', NULL, '', 4 ),
(47, NULL, 'HYDRALIC MACHINE FOR 4 PASSENGER','HYDRALIC MACHINE FOR 4 PASSENGER', 212500,1, 1, NULL, 3, '1', NULL, '', 4 ),
(48, NULL, 'HYDRALIC MACHINE FOR 6 PASSENGER', 'HYDRALIC MACHINE FOR 6 PASSENGER', 212500,1, 3, NULL, 3, '1', NULL, '', 4 ),
(49, NULL, 'HYDRALIC MACHINE FOR 8 PASSENGER', 'HYDRALIC MACHINE FOR 8 PASSENGER', 231250,1, 4, NULL, 3, '1', NULL, '', 4 ),
(50, NULL, 'HYDRALIC MACHINE FOR 10 PASSENGER', 'HYDRALIC MACHINE FOR 10 PASSENGER', 250000, 1,5, NULL, 3, '1', NULL, '', 4 ),
(51, NULL, 'HYDRALIC MACHINE FOR 13 PASSENGER', 'HYDRALIC MACHINE FOR 13 PASSENGER', 268750,1, 6, NULL, 3, '1', NULL, '', 4 ),
(52, NULL, 'HYDRALIC MACHINE FOR 15 PASSENGER', 'HYDRALIC MACHINE FOR 15 PASSENGER', 268750, 1,7, NULL, 3, '1', NULL, '', 4 ),
(53, NULL, 'HYDRALIC MACHINE FOR 20 PASSENGER', 'HYDRALIC MACHINE FOR 20 PASSENGER', 343750,1, 8, NULL, 3, '1', NULL, '', 4 ),
(54, NULL, 'HYDRALIC MACHINE FOR 25 PASSENGER','HYDRALIC MACHINE FOR 25 PASSENGER', 437500,1, 10, NULL, 3, '1', NULL, '', 4 ),
(55, NULL, 'HYDRALIC MACHINE FOR 30 PASSENGER', 'HYDRALIC MACHINE FOR 30 PASSENGER', 437500,1, 13, NULL, 3, '1', NULL, '', 4 ),
(56, NULL, 'GEARED MACHINE UNIT 5 PASSENGER', 'GEARED MACHINE UNIT 5 PASSENGER', 69375,1, 2, NULL, 1, '1', NULL, '', 4 ),
(57, NULL, 'GEARLESS MACHINE UNIT 5 PASSENGER', 'GEARLESS MACHINE UNIT 5 PASSENGER', 105000,1, 2, NULL, 2, '1', NULL, '', 4 ),
(58, NULL, 'HYDRALIC MACHINE FOR 5 PASSENGER', 'HYDRALIC MACHINE FOR 5 PASSENGER', 212500,1, 2, NULL, 3, '1', NULL, '', 4 ),
(59, NULL, 'GEARED MACHINE UNIT 10 PASSENGER', 'GEARED MACHINE UNIT 10 PASSENGER', 45000,1, 5, NULL, 1, '1', NULL, '', 4 ),
(60, NULL, 'GEARED MACHINE UNIT 10 PASSENGER', 'GEARED MACHINE UNIT 10 PASSENGER', 45000,1, 5, NULL, 1, '1', NULL, '', 4 );


-- tbl_cabin_subtype - done
INSERT INTO tbl_cabin_subtype (id, cabin_name, cabin_sub_name, prize, person_capacity_id, capacity_type, weight_id) VALUES 
(1, 1, 'CABIN M.S POWDER COATED REGULAR 4 PASSANGER', 37500, 1, 1, NULL),
(2, 1, 'CABIN M.S POWDER COATED REGULAR 6 PASSANGER', 30625, 3, 1, NULL),
(3, 1, 'CABIN M.S POWDER COATED REGULAR 8 PASSANGER', 34375, 4, 1, NULL),
(4, 1, 'CABIN M.S POWDER COATED REGULAR 10 PASSANGER', 42500, 5, 1, NULL),
(5, 1, 'CABIN M.S POWDER COATED REGULAR 12 PASSANGER', 46250, 12, 1, NULL),
(6, 1, 'CABIN M.S POWDER COATED REGULAR 13 PASSANGER', 52500, 6, 1, NULL),
(7, 1, 'CABIN M.S POWDER COATED REGULAR 15 PASSANGER', 60000, 7, 1, NULL),
(8, 1, 'CABIN M.S POWDER COATED REGULAR 18 PASSANGER', 68750, 11, 1, NULL),
(9, 1, 'CABIN M.S POWDER COATED REGULAR 20 PASSANGER', 81250, 8, 1, NULL),
(10, 1, 'CABIN M.S POWDER COATED REGULAR 22 PASSANGER', 87500, 9, 1, NULL),
(11, 1, 'CABIN M.S POWDER COATED REGULAR 25 PASSANGER', 100000, 10, 1, NULL),
(12, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 4 PASSANGER', 32500, 1, 1, NULL),
(13, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 6 PASSANGER', 33750, 3, 1, NULL),
(14, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 8 PASSANGER', 36250, 4, 1, NULL),
(15, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 10 PASSANGER', 43750, 5, 1, NULL),
(16, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 12 PASSANGER', 48750, 12, 1, NULL),
(17, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 13 PASSANGER', 60000, 6, 1, NULL),
(18, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 15 PASSANGER', 65000, 7, 1, NULL),
(19, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 18 PASSANGER', 73750, 11, 1, NULL),
(20, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 20 PASSANGER', 86250, 8, 1, NULL),
(21, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 22 PASSANGER', 93750, 9, 1, NULL),
(22, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 25 PASSANGER', 106250, 10, 1, NULL),
(23, 3, 'CABIN M.S P.C CUSTOMSIED 4 PASSANGER', 48750, 1, 1, NULL),
(24, 3, 'CABIN M.S P.C CUSTOMSIED 6 PASSANGER', 53750, 3, 1, NULL),
(25, 3, 'CABIN M.S P.C CUSTOMSIED 8 PASSANGER', 56250, 4, 1, NULL),
(26, 3, 'CABIN M.S P.C CUSTOMSIED 10 PASSANGER', 63750, 5, 1, NULL),
(27, 3, 'CABIN M.S P.C CUSTOMSIED 12 PASSANGER', 67500, 12, 1, NULL),
(28, 3, 'CABIN M.S P.C CUSTOMSIED 13 PASSANGER', 72500, 6, 1, NULL),
(29, 3, 'CABIN M.S P.C CUSTOMSIED 15 PASSANGER', 78750, 7, 1, NULL),
(30, 3, 'CABIN M.S P.C CUSTOMSIED 18 PASSANGER', 88750, 11, 1, NULL),
(31, 3, 'CABIN M.S P.C CUSTOMSIED 20 PASSANGER', 95000, 8, 1, NULL),
(32, 3, 'CABIN M.S P.C CUSTOMSIED 22 PASSANGER', 105000, 9, 1, NULL),
(33, 3, 'CABIN M.S P.C CUSTOMSIED 25 PASSANGER', 116250, 10, 1, NULL),
(34, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 4 PASSANGER', 53750, 1, 1, NULL),
(35, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 6 PASSANGER', 58750, 3, 1, NULL),
(36, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 8 PASSANGER', 61250, 4, 1, NULL),
(37, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 10 PASSANGER', 68750, 5, 1, NULL),
(38, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 12 PASSANGER', 72500, 12, 1, NULL),
(39, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 13 PASSANGER', 77500, 6, 1, NULL),
(40, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 15 PASSANGER', 83750, 7, 1, NULL),
(41, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 18 PASSANGER', 93750, 11, 1, NULL),
(42, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 20 PASSANGER', 100000, 8, 1, NULL),
(43, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 22 PASSANGER', 106250, 9, 1, NULL),
(44, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 25 PASSANGER', 118750, 10, 1, NULL),
(45, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 4 PASSANGER', 62500, 1, 1, NULL),
(46, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 6 PASSANGER', 68750, 3, 1, NULL),
(47, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 8 PASSANGER', 83750, 4, 1, NULL),
(48, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 10 PASSANGER', 90000, 5, 1, NULL),
(49, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 12 PASSANGER', 93750, 12, 1, NULL),
(50, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 13 PASSANGER', 96250, 6, 1, NULL),
(51, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 15 PASSANGER', 102500, 7, 1, NULL),
(52, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 18 PASSANGER', 108750, 11, 1, NULL),
(53, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 20 PASSANGER', 118750, 8, 1, NULL),
(54, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 22 PASSANGER', 127500, 9, 1, NULL),
(55, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 25 PASSANGER', 137500, 10, 1, NULL),
(56, 6, 'CABIN S.S HAIRLINE FINSIH 4 PASSANGER', 56250, 1, 1, NULL),
(57, 6, 'CABIN S.S HAIRLINE FINSIH 6 PASSANGER', 58750, 3, 1, NULL),
(58, 6, 'CABIN S.S HAIRLINE FINSIH 8 PASSANGER', 68750, 4, 1, NULL),
(59, 6, 'CABIN S.S HAIRLINE FINSIH 10 PASSANGER', 82500, 5, 1, NULL),
(60, 6, 'CABIN S.S HAIRLINE FINSIH 12 PASSANGER', 91250, 12, 1, NULL),
(61, 6, 'CABIN S.S HAIRLINE FINSIH 13 PASSANGER', 97500, 6, 1, NULL),
(62, 6, 'CABIN S.S HAIRLINE FINSIH 15 PASSANGER', 106250, 7, 1, NULL),
(63, 6, 'CABIN S.S HAIRLINE FINSIH 18 PASSANGER', 112500, 11, 1, NULL),
(64, 6, 'CABIN S.S HAIRLINE FINSIH 20 PASSANGER', 128750, 8, 1, NULL),
(65, 6, 'CABIN S.S HAIRLINE FINSIH 22 PASSANGER', 137500, 9, 1, NULL),
(66, 6, 'CABIN S.S HAIRLINE FINSIH 25 PASSANGER', 150000, 10, 1, NULL),
(67, 7, 'CABIN S.S MIRROR FINSIH 4 PASSANGER', 66250, 1, 1, NULL),
(68, 7, 'CABIN S.S MIRROR FINSIH 6 PASSANGER', 75000, 3, 1, NULL),
(69, 7, 'CABIN S.S MIRROR FINSIH 8 PASSANGER', 83750, 4, 1, NULL),
(70, 7, 'CABIN S.S MIRROR FINSIH 10 PASSANGER', 92500, 5, 1, NULL),
(71, 7, 'CABIN S.S MIRROR FINSIH 12 PASSANGER', 97500, 12, 1, NULL),
(72, 7, 'CABIN S.S MIRROR FINSIH 13 PASSANGER', 111250, 6, 1, NULL),
(73, 7, 'CABIN S.S MIRROR FINSIH 15 PASSANGER', 123750, 7, 1, NULL),
(74, 7, 'CABIN S.S MIRROR FINSIH 18 PASSANGER', 130000, 11, 1, NULL),
(75, 7, 'CABIN S.S MIRROR FINSIH 20 PASSANGER', 145000, 8, 1, NULL),
(76, 7, 'CABIN S.S MIRROR FINSIH 22 PASSANGER', 156250, 9, 1, NULL),
(77, 7, 'CABIN S.S MIRROR FINSIH 25 PASSANGER', 168750, 10, 1, NULL),
(78, 8, 'CABIN S.S CUSTOMISED FINSIH 4 PASSANGER', 75000, 1, 1, NULL),
(79, 8, 'CABIN S.S CUSTOMISED FINSIH 6 PASSANGER', 85000, 3, 1, NULL),
(80, 8, 'CABIN S.S CUSTOMISED FINSIH 8 PASSANGER', 93750, 4, 1, NULL),
(81, 8, 'CABIN S.S CUSTOMISED FINSIH 10 PASSANGER', 105000, 5, 1, NULL),
(82, 8, 'CABIN S.S CUSTOMISED FINSIH 12 PASSANGER', 112500, 12, 1, NULL),
(83, 8, 'CABIN S.S CUSTOMISED FINSIH 13 PASSANGER', 118750, 6, 1, NULL),
(84, 8, 'CABIN S.S CUSTOMISED FINSIH 15 PASSANGER', 131250, 7, 1, NULL),
(85, 8, 'CABIN S.S CUSTOMISED FINSIH 18 PASSANGER', 150000, 11, 1, NULL),
(86, 8, 'CABIN S.S CUSTOMISED FINSIH 20 PASSANGER', 168750, 8, 1, NULL),
(87, 8, 'CABIN S.S CUSTOMISED FINSIH 22 PASSANGER', 187500, 9, 1, NULL),
(88, 8, 'CABIN S.S CUSTOMISED FINSIH 25 PASSANGER', 212500, 10, 1, NULL),
(89, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 4 PASSANGER', 77500, 1, 1, NULL),
(90, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 6 PASSANGER', 87500, 3, 1, NULL),
(91, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 8 PASSANGER', 95000, 4, 1, NULL),
(92, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 10 PASSANGER', 105000, 5, 1, NULL),
(93, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 12 PASSANGER', 112500, 12, 1, NULL),
(94, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 13 PASSANGER', 123750, 6, 1, NULL),
(95, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 15 PASSANGER', 136250, 7, 1, NULL),
(96, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 18 PASSANGER', 142500, 11, 1, NULL),
(97, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 20 PASSANGER', 157500, 8, 1, NULL),
(98, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 22 PASSANGER', 165000, 9, 1, NULL),
(99, 10, 'CABIN Â S.S MAT FINISH 4 PASANGER', 56250, 1, 1, NULL),
(100, 10, 'CABIN Â S.S MAT FINISH 6 PASANGER', 59375, 3, 1, NULL),
(101, 10, 'CABIN Â S.S MAT FINISH 8 PASANGER', 69375, 4, 1, NULL),
(102, 10, 'CABIN Â S.S MAT FINISH 10 PASANGER', 81250, 5, 1, NULL),
(103, 10, 'CABIN Â S.S MAT FINISH 12 PASANGER', 87500, 12, 1, NULL),
(104, 10, 'CABIN Â S.S MAT FINISH 13 PASANGER', 93750, 6, 1, NULL),
(105, 10, 'CABIN Â S.S MAT FINISH 15 PASANGER', 106250, 7, 1, NULL),
(106, 10, 'CABIN Â S.S MAT FINISH 18 PASANGER', 112500, 11, 1, NULL),
(107, 10, 'CABIN Â S.S MAT FINISH 20 PASANGER', 128750, 8, 1, NULL),
(108, 10, 'CABIN Â S.S MAT FINISH 22 PASANGER', 143750, 9, 1, NULL),
(109, 10, 'CABIN Â S.S MAT FINISH 25 PASANGER', 156250, 10, 1, NULL),
(110, 11, 'CABIN Â GLASS CAPSULE 4 PASANGER', 95000, 1, 1, NULL),
(111, 11, 'CABIN Â GLASS CAPSULE 6 PASANGER', 110000, 3, 1, NULL),
(112, 11, 'CABIN Â GLASS CAPSULE 8 PASANGER', 117500, 4, 1, NULL),
(113, 11, 'CABIN Â GLASS CAPSULE 10 PASANGER', 127500, 5, 1, NULL),
(114, 11, 'CABIN Â GLASS CAPSULE 12 PASANGER', 141250, 12, 1, NULL),
(115, 11, 'CABIN Â GLASS CAPSULE 13 PASANGER', 162500, 6, 1, NULL),
(116, 11, 'CABIN Â GLASS CAPSULE 15 PASANGER', 175000, 7, 1, NULL),
(117, 11, 'CABIN Â GLASS CAPSULE 18 PASANGER', 183750, 11, 1, NULL),
(118, 11, 'CABIN Â GLASS CAPSULE 20 PASANGER', 193750, 8, 1, NULL),
(119, 11, 'CABIN Â GLASS CAPSULE 22 PASANGER', 208750, 9, 1, NULL),
(120, 11, 'CABIN Â GLASS CAPSULE 25 PASANGER', 225000, 10, 1, NULL),
(121, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 4 PASANGER', 107500, 1, 1, NULL),
(122, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 6 PASANGER', 122500, 3, 1, NULL),
(123, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 8 PASANGER', 130000, 4, 1, NULL),
(124, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 10 PASANGER', 140000, 5, 1, NULL),
(125, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 12 PASANGER', 166250, 12, 1, NULL),
(126, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 13 PASANGER', 180000, 6, 1, NULL),
(127, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 15 PASANGER', 192500, 7, 1, NULL),
(128, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 18 PASANGER', 206250, 11, 1, NULL),
(129, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 20 PASANGER', 225000, 8, 1, NULL),
(130, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 22 PASANGER', 237500, 9, 1, NULL),
(131, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 25 PASANGER', 256250, 10, 1, NULL),
(137, 3, 'CABIN M.S P.C CUSTOMSIED 1000 KG', 6250, NULL, 2, 8),
(138, 1, 'CABIN M.S POWDER COATED REGULAR 5 PASSANGER', 28750, 2, 1, NULL),
(139, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) 5 PASSANGER', 32500, 2, 1, NULL),
(140, 3, 'CABIN M.S P.C CUSTOMSIED 5 PASSANGER', 48750, 2, 1, NULL),
(141, 4, 'CABIN M.S P.C CAPSULE BACK SIDE GLASS 5 PASSANGER', 53750, 2, 1, NULL),
(142, 5, 'CABIN M.S P.C Â + GLASS CAPSULE 5 PASSANGER', 62500, 2, 1, NULL),
(143, 6, 'CABIN S.S HAIRLINE FINISH 5 PASSANGER', 56250, 2, 1, NULL),
(144, 7, 'CABIN S.S MIRROR FINISH 4 PASSANGER', 66250, 1, 1, NULL),
(145, 8, 'CABIN S.S CUSTOMISED FINISH 5 PASSANGER', 75000, 2, 1, NULL),
(146, 9, 'CABIN S.S CAPSULE + BACK SIDE GLASS 5 PASSANGER', 77500, 2, 1, NULL),
(147, 10, 'CABIN  S.S MAT FINISH 4 PASSANGER', 56250, 1, 1, NULL),
(148, 11, 'CABIN Â GLASS CAPSULE 5 PASSANGER', 95000, 2, 1, NULL),
(149, 12, 'CABIN Â GLASS CAPSULE CUSTOMISED 5 PASSANGER', 107500, 2, 1, NULL),
(150, 14, 'CABIN S S Decorative Laminated Cabin', 5700, 9, 1, NULL),
(151, 7, 'CABIN S.S MIRROR FINISH', 56985, 1, 1, NULL),
(152, 13, 'CABIN S S Decorative', 80000, 10, 1, NULL),
(153, 14, 'CABIN S S Decorative Laminated Cabin', 70000, 10, 1, NULL),
(154, 14, 'CABIN S S Decorative Laminated Cabin', 222334, 7, 1, NULL),
(155, 14, 'CABIN S S Decorative Laminated Cabin', 2333, 1, 1, NULL),
(156, 14, 'CABIN S S Decorative Laminated Cabin', 3, 2, 1, NULL),
(157, 13, 'CABIN S S Decorative Laminated Cabin', 3200, 3, 1, NULL),
(158, 1, 'CABIN M.S POWDER COATED REGULAR SUBTYPE', 75000, 5, 1, NULL),
(159, 2, 'CABIN M.S P.C + S.S MIRROR( BACK SIDE) SUBTYPE', 60000, 6, 1, NULL);



-- tbl_cabin_ceiling - done
INSERT INTO tbl_cabin_ceiling (ceiling_id, ceiling_name, price) VALUES (1, 'Standard False Ceiling', 1) ON CONFLICT (ceiling_id) DO NOTHING;
INSERT INTO tbl_cabin_ceiling (ceiling_id, ceiling_name, price) VALUES (2, 'Designer False Ceiling', 1) ON CONFLICT (ceiling_id) DO NOTHING;
INSERT INTO tbl_cabin_ceiling (ceiling_id, ceiling_name, price) VALUES (3, 'Acrylic False Ceiling', 1) ON CONFLICT (ceiling_id) DO NOTHING;
INSERT INTO tbl_cabin_ceiling (ceiling_id, ceiling_name, price) VALUES (4, 'Aluminum False Ceiling', 1) ON CONFLICT (ceiling_id) DO NOTHING;
INSERT INTO tbl_cabin_ceiling (ceiling_id, ceiling_name, price) VALUES (5, 'Perforated Metal False Ceiling', 1) ON CONFLICT (ceiling_id) DO NOTHING;
SELECT setval('tbl_cabin_ceiling_ceiling_id_seq', 5, true);

-- tbl_cabin_flooring - done
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (1, 'Chequered Plate', 2500) ON CONFLICT (flooring_id) DO NOTHING;
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (2, 'Flooring by customer', 3750) ON CONFLICT (flooring_id) DO NOTHING;
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (3, 'PVC Mat', 3125) ON CONFLICT (flooring_id) DO NOTHING;
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (4, 'Granite Flooring', 3400) ON CONFLICT (flooring_id) DO NOTHING;
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (5, 'Stainless Steel Checker Plate', 4500) ON CONFLICT (flooring_id) DO NOTHING;
INSERT INTO tbl_cabin_flooring (flooring_id, flooring_name, price) VALUES (6, 'Rubber Anti-Skid Flooring', 1524) ON CONFLICT (flooring_id) DO NOTHING;
SELECT setval('tbl_cabin_flooring_flooring_id_seq', 6, true);

-- tbl_operator_elevator - done
INSERT INTO tbl_operator_elevator (id, name) VALUES (1, 'Manual') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_operator_elevator (id, name) VALUES (2, 'Automatic') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_operator_elevator_id_seq', 2, true);

-- tbl_type_of_lift - done
INSERT INTO tbl_type_of_lift (lift_type_id, lift_type_name) VALUES (1, 'GEARED') ON CONFLICT (lift_type_id) DO NOTHING;
INSERT INTO tbl_type_of_lift (lift_type_id, lift_type_name) VALUES (2, 'GEARLESS') ON CONFLICT (lift_type_id) DO NOTHING;
INSERT INTO tbl_type_of_lift (lift_type_id, lift_type_name) VALUES (3, 'HYDRALIC') ON CONFLICT (lift_type_id) DO NOTHING;
SELECT setval('tbl_type_of_lift_lift_type_id_seq', 3, true);

-- tbl_machine_room - done
INSERT INTO tbl_machine_room (id, machine_room_name) VALUES (1, 'MACHINE ROOM') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_machine_room (id, machine_room_name) VALUES (2, 'MACHINE ROOM LESS') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_machine_room (id, machine_room_name) VALUES (3, 'Machine Room Elevator') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_machine_room_id_seq', 3, true);

-- tbl_lop_type - done
INSERT INTO tbl_lop_type (id, lop_name, operator_type) VALUES (1, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_type (id, lop_name, operator_type) VALUES (2, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH', 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_type (id, lop_name, operator_type) VALUES (3, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH', 1) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_lop_type_id_seq', 3, true);

-- tbl_car_door_type - done
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (1, 'IMPERFORATE MANUAL CABIN DOOR', 1) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (2, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION', 1) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (3, 'S,S.TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION ', 1) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (4, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH FULL VISION GLASS DOOR', 1) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (6, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION ', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION ', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (13, 'M.S.AUTOMATIC CENTER OPENING 4 PANEL CABIN DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (14, 'S.S.AUTOMATIC CENTER OPENING 4 PANEL CABIN DOOR', 2) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (15, 'COLLAPSIBLE MANUAL CABIN DOOR', 1) ON CONFLICT (car_door_id) DO NOTHING;
INSERT INTO tbl_car_door_type (car_door_id, car_door_type, operator_type) VALUES (16, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION', 1) ON CONFLICT (car_door_id) DO NOTHING;
SELECT setval('tbl_car_door_type_car_door_id_seq', 16, true);

-- tbl_landing_door_type - done
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (1, 'M S COLLAPSIBLE MANUAL LANDING DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (2, 'M.S.SWING MANUAL LANDING DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (3, 'IMPERFORATE MANUAL LANDING DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (4, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (5, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (6, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (7, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (8, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (9, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (10, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION ', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (11, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION ', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (12, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (13, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (14, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (15, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION  GLASS DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (16, 'M.S.AUTOMATIC CENTER OPENING 4 PANEL LANDING DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (17, 'S.S.AUTOMATIC CENTER OPENING 4 PANEL LANDING DOOR', 2) ON CONFLICT (door_type_id) DO NOTHING;
INSERT INTO tbl_landing_door_type (door_type_id, door_type, operator_type) VALUES (18, 'COLLAPSIBLE MANUAL LANDING DOOR', 1) ON CONFLICT (door_type_id) DO NOTHING;
SELECT setval('tbl_landing_door_type_door_type_id_seq', 18, true);

-- tbl_ard - done
INSERT INTO tbl_ard (id, ard_device, price, capacity_type, operator_type, person_capacity_id, weight_id) VALUES (1, 'Two Phase ARD', 12000, 1, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_ard (id, ard_device, price, capacity_type, operator_type, person_capacity_id, weight_id) VALUES (2, 'Single Phase UPS', 35000, 1, 1, 2, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_ard (id, ard_device, price, capacity_type, operator_type, person_capacity_id, weight_id) VALUES (3, 'Two Phase ARD', 45000, 1, 1, 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_ard (id, ard_device, price, capacity_type, operator_type, person_capacity_id, weight_id) VALUES (4, 'Single Phase UPS', 35000, 1, 1, 5, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_ard (id, ard_device, price, capacity_type, operator_type, person_capacity_id, weight_id) VALUES (5, 'Two Phase ARD', 38000, 1, 1, 4, NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_ard_id_seq', 5, true);

-- tbl_car_door_subtype - done
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (1, 1, 1, 'IMPERFORATE MANUAL CABIN DOOR 700 CLEAR OPENING', 7250, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (2, 1, 1, 'IMPERFORATE MANUAL CABIN DOOR 800 CLEAR OPENING', 7250, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (3, 1, 1, 'IMPERFORATE MANUAL CABIN DOOR 900 CLEAR OPENING', 8125, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (4, 1, 2, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION & 600 CLEAR OPENING', 13225, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (5, 1, 2, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION & 700 CLEAR OPENING', 14150, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (6, 1, 2, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION & 800 CLEAR OPENING', 14963, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (7, 1, 2, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION & 900 CLEAR OPENING', 15775, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (8, 1, 3, 'S,S.TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION DOOR 600 CLEAR OPENING', 26888, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (9, 1, 3, 'S,S.TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION DOOR 700 CLEAR OPENING', 28300, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (10, 1, 3, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION DOOR 800 CLEAR OPENING', 30125, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (11, 1, 3, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION DOOR 900 CLEAR OPENING', 31963, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (12, 1, 4, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH FULL VISION GLASS DOOR 600 CLEAR OPENING', 23125, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (13, 1, 4, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH FULL VISION GLASS DOOR 700 CLEAR OPENING', 23125, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (14, 1, 4, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH FULL VISION GLASS DOOR 800 CLEAR OPENING', 23125, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (15, 1, 4, 'S.S.TELESCOPIC MANUAL CABIN DOOR WITH FULL VISION GLASS DOOR 900 CLEAR OPENING', 26875, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (16, 2, 5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  700 CLEAR OPENING', 56250, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (17, 2, 5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  800 CLEAR OPENING', 56250, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (18, 2, 5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  900 CLEAR OPENING', 65000, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (19, 2, 5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  1000 CLEAR OPENING', 68750, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (20, 2, 5, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  1200 CLEAR OPENING', 80000, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (21, 2, 6, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  700 CLEAR OPENING', 68750, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (22, 2, 6, 'S.S.AAUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  800 CLEAR OPENING', 68750, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (23, 2, 6, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  900 CLEAR OPENING', 75000, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (24, 2, 6, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  1000 CLEAR OPENING', 87500, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (25, 2, 6, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH SMALL VISSION  1200 CLEAR OPENING', 92500, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (26, 2, 7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  700 CLEAR OPENING', 56250, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (27, 2, 7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  800 CLEAR OPENING', 56250, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (28, 2, 7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  900 CLEAR OPENING', 62500, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (29, 2, 7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  1000 CLEAR OPENING', 75000, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (30, 2, 7, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  1200 CLEAR OPENING', 81250, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (31, 2, 8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  700 CLEAR OPENING', 68750, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (32, 2, 8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  800 CLEAR OPENING', 68750, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (33, 2, 8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  900 CLEAR OPENING', 75000, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (34, 2, 8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  1000 CLEAR OPENING', 87500, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (35, 2, 8, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH SMALL VISSION  1200 CLEAR OPENING', 92500, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (36, 2, 9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 700 CLEAR OPENING', 77500, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (37, 2, 9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 800 CLEAR OPENING', 77500, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (38, 2, 9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 900 CLEAR OPENING', 81250, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (39, 2, 9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1000 CLEAR OPENING', 86250, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (40, 2, 9, 'M.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1200 CLEAR OPENING', 90000, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (41, 2, 10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 700 CLEAR OPENING', 83750, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (42, 2, 10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 800 CLEAR OPENING', 83750, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (43, 2, 10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 900 CLEAR OPENING', 88750, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (44, 2, 10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1000 CLEAR OPENING', 93750, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (45, 2, 10, 'S.S.AUTOMATIC TELESCOPIC OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1200 CLEAR OPENING', 98750, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (46, 2, 11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 700 CLEAR OPENING', 77500, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (47, 2, 11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 800 CLEAR OPENING', 77500, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (48, 2, 11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 900 CLEAR OPENING', 81250, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (49, 2, 11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1000 CLEAR OPENING', 86250, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (50, 2, 11, 'M.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1200 CLEAR OPENING', 90000, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (51, 2, 12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 700 CLEAR OPENING', 83750, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (52, 2, 12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 800 CLEAR OPENING', 83750, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (53, 2, 12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 900 CLEAR OPENING', 88750, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (54, 2, 12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1000 CLEAR OPENING', 93750, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (55, 2, 12, 'S.S.AUTOMATIC CENTER OPENING CABIN DOOR WITH FULL VISSION  GLASS DOOR 1200 CLEAR OPENING', 98750, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (56, 2, 13, 'M.S.AUTOMATIC CENTER OPENING 4 PANEL CABIN DOOR WITH SMALL VISSION  600 CLEAR OPENING', 81250, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (57, 2, 13, 'M.S.AUTOMATIC CENTER OPENING 4 PANEL CABIN DOOR WITH FULL VISSION GLASS DOOR 600 CLEAR OPENING', 88750, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (58, 2, 14, 'S.S.AUTOMATIC CENTER OPENING 4 PANEL CABIN DOOR WITH SMALL VISSION  600 CLEAR OPENING', 88750, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (59, 1, 15, 'COLLAPSIBLE MANUAL CABIN DOOR WITH DOOR FRAME 700 CLEAR OPENING', 4375, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (60, 1, 15, 'COLLAPSIBLE MANUAL CABIN DOOR WITH DOOR FRAME 800 CLEAR OPENING', 4375, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (61, 1, 15, 'COLLAPSIBLE MANUAL CABIN DOOR WITH DOOR FRAME 900 CLEAR OPENING', 6250, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (62, 1, 1, 'IMPERFORATE MANUAL CABIN DOOR subtype', 5000, 0) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_car_door_subtype (id, operator_type, car_door_type, car_door_subtype, price, size) VALUES (63, 1, 16, 'M.S TELESCOPIC MANUAL CABIN DOOR WITH SMALL VISION subtype', 60000, 0) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_car_door_subtype_id_seq', 63, true);



-- tbl_landing_door_subtype
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (1, 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 600 CLEAR OPENING', 1, 6250, 18, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (2, 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 700 CLEAR OPENING', 1, 4375, 18, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (3, 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 800 CLEAR OPENING', 1, 4375, 18, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (4, 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 900 CLEAR OPENING', 1, 6250, 18, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (5, 'COLLAPSIBLE MANUAL LANDING DOOR WITH DOOR FRAME 1000 CLEAR OPENING', 1, 12500, 18, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (8, 'M.S.SWING MANUAL LANDING DOOR WITH DOOR FRAME 600 CLEAR OPENING', 1, 13438, 2, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (9, 'M.S.SWING MANUAL LANDING DOOR WITH DOOR FRAME 700 CLEAR OPENING', 1, 13650, 2, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (10, 'M.S.SWING MANUAL LANDING DOOR WITH DOOR FRAME 800 CLEAR OPENING', 1, 14550, 2, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (11, 'IMPERFORATE MANUAL LANDING DOOR WITH DOOR FRAME 600 CLEAR OPENING', 1, 10000, 3, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (12, 'IMPERFORATE MANUAL LANDING DOOR WITH DOOR FRAME 700 CLEAR OPENING', 1, 10625, 3, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (13, 'IMPERFORATE MANUAL LANDING DOOR WITH DOOR FRAME 800 CLEAR OPENING', 1, 11875, 3, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (14, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 600 CLEAR OPENING', 1, 13838, 4, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (15, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 700 CLEAR OPENING', 1, 14775, 4, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (16, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 800 CLEAR OPENING', 1, 15588, 4, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (17, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 900 CLEAR OPENING', 1, 16400, 4, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (18, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 600 CLEAR OPENING', 1, 27500, 5, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (19, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 700 CLEAR OPENING', 1, 28913, 5, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (20, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 800 CLEAR OPENING', 1, 30750, 5, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (21, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH SMALL VISION & DOOR FRAME IN 900 CLEAR OPENING', 1, 32588, 5, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (22, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 600 CLEAR OPENING', 1, 16875, 6, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (23, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 700 CLEAR OPENING', 1, 16875, 6, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (24, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 800 CLEAR OPENING', 1, 16875, 6, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (25, 'M.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 900 CLEAR OPENING', 1, 19375, 6, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (26, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 600 CLEAR OPENING', 1, 29375, 7, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (27, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 700 CLEAR OPENING', 1, 29375, 7, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (28, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 800 CLEAR OPENING', 1, 30000, 7, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (29, 'S.S.TELESCOPIC MANUAL LANDING DOOR WITH FULL VISION GLASS DOOR & DOOR FRAME IN 900 CLEAR OPENING', 1, 33125, 7, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (30, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 700 CLEAR OPENING', 2, 17500, 8, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (31, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 800 CLEAR OPENING', 2, 17500, 8, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (32, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 900 CLEAR OPENING', 2, 21250, 8, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (33, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 1000 CLEAR OPENING', 2, 29375, 8, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (34, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 1200 CLEAR OPENING', 2, 35000, 8, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (35, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 700 CLEAR OPENING', 2, 27000, 9, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (36, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 800 CLEAR OPENING', 2, 27000, 9, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (37, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 900 CLEAR OPENING', 2, 29375, 9, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (38, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 1000 CLEAR OPENING', 2, 33750, 9, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (39, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH SMALL VISSION 1200 CLEAR OPENING', 2, 38750, 9, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (40, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 700 CLEAR OPENING', 2, 17500, 10, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (41, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 800 CLEAR OPENING', 2, 17500, 10, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (42, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 900 CLEAR OPENING', 2, 21250, 10, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (43, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 1000 CLEAR OPENING', 2, 29000, 10, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (44, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 1200 CLEAR OPENING', 2, 35000, 10, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (45, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 700 CLEAR OPENING', 2, 25625, 11, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (46, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 800 CLEAR OPENING', 2, 25625, 11, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (47, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 900 CLEAR OPENING', 2, 29375, 11, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (48, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 1000 CLEAR OPENING', 2, 33750, 11, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (49, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH SMALL VISSION 1200 CLEAR OPENING', 2, 38750, 11, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (50, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 700 CLEAR OPENING', 2, 35000, 12, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (51, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 800 CLEAR OPENING', 2, 35000, 12, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (52, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 900 CLEAR OPENING', 2, 36250, 12, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (53, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1000 CLEAR OPENING', 2, 36250, 12, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (54, 'M.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1200 CLEAR OPENING', 2, 38750, 12, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (55, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 700 CLEAR OPENING', 2, 40000, 13, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (56, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 800 CLEAR OPENING', 2, 40000, 13, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (57, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 900 CLEAR OPENING', 2, 42500, 13, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (58, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1000 CLEAR OPENING', 2, 43750, 13, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (59, 'S.S.AUTOMATIC TELESCOPIC OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1200 CLEAR OPENING', 2, 46250, 13, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (60, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 700 CLEAR OPENING', 2, 35000, 14, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (61, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 800 CLEAR OPENING', 2, 35000, 14, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (62, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 900 CLEAR OPENING', 2, 36250, 14, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (63, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1000 CLEAR OPENING', 2, 36250, 14, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (64, 'M.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1200 CLEAR OPENING', 2, 38750, 14, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (65, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 700 CLEAR OPENING', 2, 40000, 15, 700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (66, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 800 CLEAR OPENING', 2, 40000, 15, 800) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (67, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 900 CLEAR OPENING', 2, 42500, 15, 900) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (68, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1000 CLEAR OPENING', 2, 43750, 15, 1000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (69, 'S.S.AUTOMATIC CENTER OPENING LANDING DOOR WITH FULL VISSION GLASS DOOR 1200 CLEAR OPENING', 2, 46250, 15, 1200) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (70, 'M.S.AUTOMATIC CENTER OPENING 4 PANEL LANDING DOOR WITH SMALL VISSION 600 CLEAR OPENING', 2, 32500, 16, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (71, 'S.S.AUTOMATIC CENTER OPENING 4 PANEL LANDING DOOR WITH SMALL VISSION 600 CLEAR OPENING', 2, 41250, 17, 600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_landing_door_subtype (id, name, operator_type, prize, main_door_type, size) VALUES (72, 'M S COLLAPSIBLE MANUAL LANDING DOOR', 1, 5000, 1, 0) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_landing_door_subtype_id_seq', 72);

-- tbl_control_panel_type - done
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (1, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 1, 1, 75000, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (2, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 1, 1, 60375, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (3, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 1, 1, 65875, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (4, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 1, 1, 76250, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (5, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 1, 1, 88438, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (6, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 1, 1, 100938, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (7, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 1, 1, 114469, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (8, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 1, 1, 125719, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (9, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 1, 1, 138219, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (10, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 1, 2, 69625, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (11, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 1, 2, 69625, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (12, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 1, 2, 77750, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (13, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 1, 2, 87750, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (14, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 1, 2, 100250, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (15, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 1, 2, 112750, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (16, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 1, 2, 131250, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (17, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 1, 2, 143750, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (18, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 1, 2, 150000, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (19, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 2, 1, 94375, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (20, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 2, 1, 94375, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (21, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 2, 1, 101875, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (22, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 2, 1, 108125, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (23, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 2, 1, 120500, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (24, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 2, 1, 131250, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (25, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 2, 1, 143750, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (26, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 2, 1, 156250, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (27, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 2, 1, 162500, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (28, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 2, 2, 94375, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (29, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 2, 2, 94375, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (30, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 2, 2, 101875, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (31, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 2, 2, 108125, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (32, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 2, 2, 120500, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (33, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 2, 2, 131250, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (34, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 2, 2, 143750, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (35, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 2, 2, 156250, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (36, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 2, 2, 162500, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (37, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 3, 2, 54025, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (38, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 3, 2, 54025, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (39, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 3, 2, 57775, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (40, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 3, 2, 61525, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (41, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 3, 2, 68750, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (42, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 3, 2, 81250, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (43, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 3, 2, 87500, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (44, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 3, 2, 93750, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (45, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 3, 2, 93750, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (46, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 4 person_capacity_id 5 HP', 3, 1, 54025, 1, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (47, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 6 person_capacity_id 5 HP', 3, 1, 54025, 3, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (48, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 3, 1, 57775, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (49, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 3, 1, 61525, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (50, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 13 person_capacity_id 15 HP', 3, 1, 68750, 6, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (51, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 15 person_capacity_id 20 HP', 3, 1, 81250, 7, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (52, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 20 person_capacity_id 30 HP', 3, 1, 87500, 8, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (53, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 25 person_capacity_id 30 HP', 3, 1, 93750, 10, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (54, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 30 person_capacity_id 30 HP', 3, 1, 93750, 13, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (74, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 1, 1, 75000, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (75, 'CONTROL PANEL FOR GEARED AUTOMATIC LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 1, 2, 69625, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (76, 'CONTROL PANEL FOR GEARLESS MANUAL LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 2, 1, 94375, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (77, 'CONTROL PANEL FOR GEARLESS AUTOMATIC LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 2, 2, 94375, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (78, 'CONTROL PANEL FOR Hydraulic AUTOMATIC LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 2, 2, 54025, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (79, 'CONTROL PANEL FOR Hydraulic MANUAL LIFT WITH V3F DRIVE FOR 5 person_capacity_id 5 HP', 2, 1, 54025, 2, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (82, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 1, 1, 75000, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (83, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 8 person_capacity_id 7.5 HP', 2, 2, 78000, 4, 1, NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_control_panel_type (id, control_panel_type, machine_type, operator_type, price, person_capacity_id, capacity_type, weight_id) VALUES (84, 'CONTROL PANEL FOR GEARED MANUAL LIFT WITH V3F DRIVE FOR 10 person_capacity_id 10 HP', 1, 1, 75000, 5, 1, NULL) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_control_panel_type_id_seq', 84, true);

-- tbl_cop  -donee
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (1, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 2, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (2, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 3, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (3, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 4, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (4, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 5, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (5, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 6, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (6, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 7, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (7, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 8, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (8, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 9, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (9, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 10, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (10, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 11, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (11, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 12, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (12, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 13, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (13, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 14, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (14, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 15, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (15, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 16, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (16, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 17, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (17, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 18, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (18, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 19, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (19, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 20, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (20, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 21, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (21, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 22, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (22, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 23, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (23, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 24, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (24, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 25, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (25, 'C.O.P WITH  INDIAN SWITCH WITH SURFACE MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 26, 10625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (26, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 2, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (27, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 3, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (28, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 4, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (29, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 5, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (30, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 6, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (31, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 7, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (32, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 8, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (33, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 9, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (34, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 10, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (35, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 11, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (36, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 12, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (37, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 13, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (38, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 14, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (39, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 15, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (40, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 16, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (41, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 17, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (42, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 18, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (43, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 19, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (44, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 20, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (45, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 21, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (46, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 22, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (47, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 23, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (48, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 24, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (49, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 25, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (50, 'C.O.P WITH  INDIAN SWITCH WITH FLUSH MOUNTED S.S.HAIRLINE FOR MANUAL LIFT', 1, 26, 10000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (51, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+1', 2, 2, 14188, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (52, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+2', 2, 3, 14188, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (53, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+3', 2, 4, 15606, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (54, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+4', 2, 5, 17025, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (55, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+5', 2, 6, 18444, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (56, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+6', 2, 7, 19579, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (57, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+7', 2, 8, 22416, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (58, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+8', 2, 9, 23835, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (59, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+9', 2, 10, 24550, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (60, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+10', 2, 11, 25538, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (61, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+11', 2, 12, 26673, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (62, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+12', 2, 13, 27949, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (63, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+13', 2, 14, 29226, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (64, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+14', 2, 15, 30500, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (65, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+15', 2, 16, 31780, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (66, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+16', 2, 17, 33500, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (67, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+17', 2, 18, 34334, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (68, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+18', 2, 19, 35625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (69, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+19', 2, 20, 36888, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (70, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+20', 2, 21, 38169, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (71, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+21', 2, 22, 40625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (72, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+22', 2, 23, 41875, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (73, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+23', 2, 24, 43125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (74, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+24', 2, 25, 44375, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (75, 'C.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR AUTOMATIC LIFT G+25', 2, 26, 45625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (76, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+1', 2, 2, 23125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (77, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+2', 2, 3, 23125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (78, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+3', 2, 4, 23125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (79, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+4', 2, 5, 23750, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (80, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+5', 2, 6, 24375, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (81, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+6', 2, 7, 25000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (82, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+7', 2, 8, 25625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (83, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+8', 2, 9, 26250, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (84, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+9', 2, 10, 26875, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (85, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+10', 2, 11, 27500, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (86, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+11', 2, 12, 28125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (87, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+12', 2, 13, 28750, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (88, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+13', 2, 14, 29375, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (89, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+14', 2, 15, 30000, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (90, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+15', 2, 16, 30625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (91, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+16', 2, 17, 31875, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (92, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+17', 2, 18, 33125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (93, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+18', 2, 19, 34375, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (94, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+19', 2, 20, 35625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (95, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+20', 2, 21, 36875, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (96, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+21', 2, 22, 38125, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (97, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+22', 2, 23, 39375, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (98, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+23', 2, 24, 40625, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (99, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+24', 2, 25, 41875, '') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_cop (id, cop_name, operator_type, floors, price, cop_type) VALUES (100, 'C.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR AUTOMATIC LIFT G+25', 2, 26, 43125, '') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_cop_id_seq', 100, true);

-- tbl_counter_frame -- done
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (1, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 4 PASANGER', 1, 1,1, 1,NULL, 30000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (2, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 6 PASANGER', 1, 1,1, 3, NULL, 30000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (3, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 8 PASANGER', 1, 1,1, 4, NULL, 31875) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (4, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 10 PASANGER', 1, 1,1, 5, NULL, 35000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (5, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 12 PASANGER', 1, 1,1, 12, NULL, 37500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (6, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 13 PASANGER', 1, 1,1, 6, NULL, 41250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (7, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 15 PASANGER', 1, 1,1, 7, NULL, 43750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (8, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 18 PASANGER', 1, 1,1, 11,NULL, 56250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (9, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 20 PASANGER', 1, 1,1, 8, NULL, 81250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (10, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 22 PASANGER', 1, 1,1, 9, NULL, 93750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (11, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 25 PASANGER', 1, 1,1, 10, NULL, 112500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (12, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1ST 1 STANDARD ROPING 30 PASANGER', 1, 1,1, 13, NULL, 118750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (13, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 4 PASANGER', 2, 1,1, 1, NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (14, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 6 PASANGER', 2, 1,1, 3,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (15, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 8 PASANGER', 2, 1,1, 4, NULL, 60000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (16, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 10 PASANGER', 2, 1,1, 5,NULL, 67500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (17, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 12 PASANGER', 2, 1,1, 12,NULL, 70000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (18, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 13 PASANGER', 2, 1,1, 6,NULL, 72500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (19, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 15 PASANGER', 2, 1,1, 7,NULL, 106250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (20, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 18 PASANGER', 2, 1,1, 11,NULL, 117500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (21, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 20 PASANGER', 2, 1,1, 8,NULL, 131250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (22, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 22 PASANGER', 2, 1,1, 9,NULL, 137500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (23, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 25 PASANGER', 2, 1,1, 10,NULL, 150000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (24, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 30 PASANGER', 2, 1,1, 13,NULL, 156250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (25, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 4 PASANGER', 3, 2,1, 1,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (26, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 6 PASANGER', 3, 2,1, 3,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (27, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 8 PASANGER', 3, 2,1, 4,NULL, 60000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (28, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 10 PASANGER', 3, 2,1, 5,NULL, 67500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (29, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 12 PASANGER', 3, 2,1, 12,NULL, 70000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (30, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 13 PASANGER', 3, 2,1, 6,NULL, 72500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (31, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 15 PASANGER', 3, 2,1, 7,NULL, 106250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (32, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 18 PASANGER', 3, 2,1, 11,NULL, 117500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (33, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 20 PASANGER', 3, 2,1, 8,NULL, 131250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (34, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 22 PASANGER', 3, 2,1, 9,NULL, 137500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (35, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 25 PASANGER', 3, 2,1, 10,NULL, 150000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (36, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 30 PASANGER', 3, 2,1, 13,NULL, 156250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (37, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 4 PASANGER', 4, 3,1, 1,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (38, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 6 PASANGER', 4, 3,1, 3,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (39, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 8 PASANGER', 4, 3,1, 4,NULL, 60000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (40, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 10 PASANGER', 4, 3,1, 5,NULL, 67500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (41, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 12 PASANGER', 4, 3,1, 12,NULL, 72500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (42, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 13 PASANGER', 4, 3,1, 6,NULL, 92500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (43, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 15 PASANGER', 4, 3,1, 7,NULL, 106250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (44, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 18 PASANGER', 4, 3,1, 11,NULL, 117500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (45, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 20 PASANGER', 4, 3,1, 8,NULL, 131250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (46, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 22 PASANGER', 4, 3,1, 9,NULL, 137500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (47, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 25 PASANGER', 4, 3,1, 10,NULL, 150000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (48, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 30 PASANGER', 4, 3,1, 13,NULL, 156250) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (49, 'CAR & COUNTER WEIGHT FRAME SET GEARED 1 ST 1 STANDARD ROPING 5 PASANGER', 1, 1,1, 2,NULL, 30000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (50, 'CAR & COUNTER WEIGHT FRAME SET GEARED 2 ST 1 ROPING WITH PULLY 5 PASANGER', 2, 1,1, 2,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (51, 'CAR & COUNTER WEIGHT FRAME SET GEARELESS 2 ST 1 ROPING WITH PULLY 5 PASANGER', 3, 2,1, 2,NULL, 58750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_frame (id, counter_frame_name, counter_frame_type, machine_type_id, capacity_type, person_capacity_id, weight_id, price) VALUES (52, 'CAR & COUNTER WEIGHT FRAME SET HYDRALIC 2 ST 1 ROPING WITH PULLY 5 PASANGER', 4, 3,1, 2,NULL, 58750) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_counter_frame_id_seq', 52, true);

-- tbl_fastener - done
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (1, 'HARDWARE WITH FASTNER For G+1', 2, 4000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (2, 'HARDWARE WITH FASTNER For G+2', 3, 5500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (3, 'HARDWARE WITH FASTNER For G+3', 4, 7000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (4, 'HARDWARE WITH FASTNER For G+4', 5, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (5, 'HARDWARE WITH FASTNER For G+5', 6, 10000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (6, 'HARDWARE WITH FASTNER For G+6', 7, 11500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (7, 'HARDWARE WITH FASTNER For G+7', 8, 13000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (8, 'HARDWARE WITH FASTNER For G+8', 9, 14500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (9, 'HARDWARE WITH FASTNER For G+9', 10, 16000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (10, 'HARDWARE WITH FASTNER For G+10', 11, 17500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (11, 'HARDWARE WITH FASTNER For G+11', 12, 19000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (12, 'HARDWARE WITH FASTNER For G+12', 13, 20500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (13, 'HARDWARE WITH FASTNER For G+13', 14, 22000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (14, 'HARDWARE WITH FASTNER For G+14', 15, 23500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (15, 'HARDWARE WITH FASTNER For G+15', 16, 25000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (16, 'HARDWARE WITH FASTNER For G+16', 17, 26500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (17, 'HARDWARE WITH FASTNER For G+17', 18, 28000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (18, 'HARDWARE WITH FASTNER For G+18', 19, 29500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (19, 'HARDWARE WITH FASTNER For G+19', 20, 31000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (20, 'HARDWARE WITH FASTNER For G+20', 21, 32500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (21, 'HARDWARE WITH FASTNER For G+21', 22, 34000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (22, 'HARDWARE WITH FASTNER For G+22', 23, 35500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (23, 'HARDWARE WITH FASTNER For G+23', 24, 37000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (24, 'HARDWARE WITH FASTNER For G+24', 25, 38500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (25, 'HARDWARE WITH FASTNER For G+25', 26, 40000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (26, 'HARDWARE WITH FASTNER For G+26', 27, 41500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (27, 'HARDWARE WITH FASTNER For G+27', 28, 43000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (28, 'HARDWARE WITH FASTNER For G+28', 29, 44500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (29, 'HARDWARE WITH FASTNER For G+29', 30, 46000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_fastener (id, fastener_name, floors, price) VALUES (30, 'HARDWARE WITH FASTNER For G+30', 31, 47500) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_fastener_id_seq', 30, true);

-- tbl_governor_rope -done
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (1, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+1', 1625, 2, '20') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (2, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+2', 2275, 3, '28') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (3, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+3', 2600, 4, '32') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (4, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+4', 3250, 5, '40') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (5, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+6', 4225, 7, '52') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (6, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+7', 4713, 8, '58') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (7, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+8', 5200, 9, '64') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (8, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+9', 5688, 10, '70') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (9, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+10', 6094, 11, '75') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (10, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+11', 6500, 12, '80') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (11, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+12', 6988, 13, '86') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (12, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+13', 7475, 14, '92') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (13, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+14', 7963, 15, '98') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (14, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+15', 8450, 16, '104') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (15, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+16', 8938, 17, '110') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (16, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+17', 9425, 18, '116') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (17, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+18', 9913, 19, '122') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (18, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+19', 10400, 20, '128') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (19, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+20', 10888, 21, '134') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (20, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+21', 11375, 22, '140') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (21, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+22', 11863, 23, '146') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (22, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+23', 12350, 24, '152') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (23, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+24', 12838, 25, '158') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (24, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+25', 13325, 26, '164') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (25, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+26', 13813, 27, '170') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (26, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+27', 14300, 28, '176') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (27, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+28', 14788, 29, '182') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (28, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+29', 15275, 30, '188') ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_governor_rope (id, governor_name, prize, floor_id, quantity) VALUES (29, 'OVERSPEED GOVERNER SAFETY ROPE 8 MM G+30', 15763, 31, '194') ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_governor_rope_id_seq', 29, true);

-- tbl_harness -done
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (1, 'WIRING PLUGABLE HARNES FOR G+1', 13750, 2) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (2, 'WIRING PLUGABLE HARNES FOR G+2', 15625, 3) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (3, 'WIRING PLUGABLE HARNES FOR G+3', 15625, 4) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (4, 'WIRING PLUGABLE HARNES FOR G+4', 16875, 5) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (5, 'WIRING PLUGABLE HARNES FOR G+5', 19375, 6) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (6, 'WIRING PLUGABLE HARNES FOR G+6', 21875, 7) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (7, 'WIRING PLUGABLE HARNES FOR G+7', 24375, 8) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (8, 'WIRING PLUGABLE HARNES FOR G+8', 26875, 9) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (9, 'WIRING PLUGABLE HARNES FOR G+9', 29375, 10) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (10, 'WIRING PLUGABLE HARNES FOR G+10', 31875, 11) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (11, 'WIRING PLUGABLE HARNES FOR G+11', 34375, 12) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (12, 'WIRING PLUGABLE HARNES FOR G+12', 36875, 13) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (13, 'WIRING PLUGABLE HARNES FOR G+13', 39375, 14) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (14, 'WIRING PLUGABLE HARNES FOR G+14', 41875, 15) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (15, 'WIRING PLUGABLE HARNES FOR G+15', 44375, 16) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (16, 'WIRING PLUGABLE HARNES FOR G+16', 46875, 17) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (17, 'WIRING PLUGABLE HARNES FOR G+17', 49375, 18) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (18, 'WIRING PLUGABLE HARNES FOR G+18', 51875, 19) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (19, 'WIRING PLUGABLE HARNES FOR G+19', 54375, 20) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (20, 'WIRING PLUGABLE HARNES FOR G+20', 56875, 21) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (21, 'WIRING PLUGABLE HARNES FOR G+21', 59375, 22) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (22, 'WIRING PLUGABLE HARNES FOR G+22', 61875, 23) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (23, 'WIRING PLUGABLE HARNES FOR G+23', 64375, 24) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (24, 'WIRING PLUGABLE HARNES FOR G+24', 66875, 25) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (25, 'WIRING PLUGABLE HARNES FOR G+25', 69375, 26) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (26, 'WIRING PLUGABLE HARNES FOR G+26', 71875, 27) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (27, 'WIRING PLUGABLE HARNES FOR G+27', 74375, 28) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (28, 'WIRING PLUGABLE HARNES FOR G+28', 76875, 29) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (29, 'WIRING PLUGABLE HARNES FOR G+29', 79375, 30) ON CONFLICT (harness_id) DO NOTHING;
INSERT INTO tbl_harness (harness_id, harness_name, harness_price, floors) VALUES (30, 'WIRING PLUGABLE HARNES FOR G+30', 81875, 31) ON CONFLICT (harness_id) DO NOTHING;
SELECT setval('tbl_harness_harness_id_seq', 30, true);

-- tbl_lop_subtype -done
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (1, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+1', 2, 3250, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (2, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+2', 3, 4875, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (3, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+3', 4, 6500, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (4, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+4', 5, 8125, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (5, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+5', 6, 9750, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (6, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+6', 7, 11375, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (7, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+7', 8, 13000, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (8, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+8', 9, 14625, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (9, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+9', 10, 16250, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (10, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+10', 11, 17875, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (11, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+11', 12, 19500, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (12, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+12', 13, 21125, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (13, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+13', 14, 22750, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (14, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+14', 15, 24375, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (15, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+15', 16, 26000, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (16, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+16', 17, 27625, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (17, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+17', 18, 29250, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (18, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+18', 19, 30875, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (19, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+19', 20, 32500, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (20, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+20', 21, 34125, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (21, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+21', 22, 35750, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (22, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+22', 23, 37375, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (23, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+23', 24, 39000, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (24, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+24', 25, 40625, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (25, 'L.O.P WITH INDIAN SWITCH WITH SURFACE MOUNTED S.S. HAIRLINE FINISH FOR MANUAL LIFT G+25', 26, 42250, 3) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (26, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+1', 2, 6250, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (27, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+2', 3, 9375, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (28, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+3', 4, 12500, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (29, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+4', 5, 15625, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (30, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+5', 6, 18750, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (31, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+6', 7, 21875, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (32, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+7', 8, 25000, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (33, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+8', 9, 28125, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (34, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+9', 10, 31250, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (35, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+10', 11, 34375, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (36, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+11', 12, 37500, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (37, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+12', 13, 40625, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (38, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+13', 14, 43750, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (39, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+14', 15, 46875, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (40, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+15', 16, 50000, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (41, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+16', 17, 53125, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (42, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+17', 18, 56250, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (43, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+18', 19, 59375, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (44, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+19', 20, 62500, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (45, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+20', 21, 65625, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (46, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+21', 22, 68750, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (47, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+22', 23, 71875, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (48, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+23', 24, 75000, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (49, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+24', 25, 78125, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (50, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+25', 26, 81250, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (51, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+1', 2, 7500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (52, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+2', 3, 11250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (53, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+3', 4, 15000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (54, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+4', 5, 18750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (55, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+5', 6, 22500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (56, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+6', 7, 26250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (57, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+7', 8, 30000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (58, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+8', 9, 33750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (59, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+9', 10, 37500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (60, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+10', 11, 41250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (61, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+11', 12, 45000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (62, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+12', 13, 48750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (63, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+13', 14, 52500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (64, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+14', 15, 56250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (65, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+15', 16, 60000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (66, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+16', 17, 63750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (67, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+17', 18, 67500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (68, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+18', 19, 71250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (69, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+19', 20, 75000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (70, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+20', 21, 78750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (71, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+21', 22, 82500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (72, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+22', 23, 86250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (73, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+23', 24, 90000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (74, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+24', 25, 93750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (75, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+25', 26, 97500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (76, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+26', 27, 84375, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (77, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+27', 28, 87500, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (78, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+28', 29, 90625, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (79, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+29', 30, 93750, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (80, 'L.O.P WITH B.S.T SWITCH WITH SURFACE MOUNTED LINEN FINISH FOR G+30', 31, 96875, 1) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (81, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+26', 27, 101250, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (82, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+27', 28, 105000, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (83, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+28', 29, 108750, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (84, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+29', 30, 112500, 2) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_lop_subtype (id, lop_name, floors, price, lop_type) VALUES (85, 'L.O.P WITH TOUCH SWITCH WITH SURFACE MOUNTED ACRYLIC FINISH FOR G+30', 31, 116250, 2) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_lop_subtype_id_seq', 85, true);

-- tbl_bracket - done
INSERT INTO tbl_bracket (id, car_bracket_sub_type, price, floor_id, bracket_type) VALUES
(1, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+1', 5000, '2', 1),
(2, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+2', 6750, '3', 1),
(3, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+3', 7313, '4', 1),
(4, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+4', 8438, '5', 1),
(5, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+5', 10125, '6', 1),
(6, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+6', 11250, '7', 1),
(7, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+7', 12375, '8', 1),
(8, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+8', 13500, '9', 1),
(9, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+9', 15188, '10', 1),
(10, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+10', 16875, '11', 1),
(11, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+11', 18000, '12', 1),
(12, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+12', 19125, '13', 1),
(13, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+13', 20250, '14', 1),
(14, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+14', 21938, '15', 1),
(15, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+15', 23063, '16', 1),
(16, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+16', 24750, '17', 1),
(17, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+17', 25875, '18', 1),
(18, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+18', 27000, '19', 1),
(19, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+19', 28688, '20', 1),
(20, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+20', 29813, '21', 1),
(21, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+21', 30938, '22', 1),
(22, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+22', 32625, '23', 1),
(23, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+23', 34500, '24', 1),
(24, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+24', 36375, '25', 1),
(25, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+25', 38250, '26', 1),

(26, 'COMBINATION BRACKET FOR G+1', 9125, '2', 2),
(27, 'COMBINATION BRACKET FOR G+2', 11406, '3', 2),
(28, 'COMBINATION BRACKET FOR G+3', 13688, '4', 2),
(29, 'COMBINATION BRACKET FOR G+4', 13688, '5', 2),
(30, 'COMBINATION BRACKET FOR G+5', 15969, '6', 2),
(31, 'COMBINATION BRACKET FOR G+6', 20531, '7', 2),
(32, 'COMBINATION BRACKET FOR G+7', 25094, '8', 2),
(33, 'COMBINATION BRACKET FOR G+8', 27375, '9', 2),
(34, 'COMBINATION BRACKET FOR G+9', 30796, '10', 2),
(35, 'COMBINATION BRACKET FOR G+10', 34169, '11', 2),
(36, 'COMBINATION BRACKET FOR G+11', 36500, '12', 2),
(37, 'COMBINATION BRACKET FOR G+12', 38781, '13', 2),
(38, 'COMBINATION BRACKET FOR G+13', 41063, '14', 2),
(39, 'COMBINATION BRACKET FOR G+14', 53438, '15', 2),
(40, 'COMBINATION BRACKET FOR G+15', 57656, '16', 2),
(41, 'COMBINATION BRACKET FOR G+16', 61875, '17', 2),
(42, 'COMBINATION BRACKET FOR G+17', 64688, '18', 2),
(43, 'COMBINATION BRACKET FOR G+18', 67500, '19', 2),
(44, 'COMBINATION BRACKET FOR G+19', 71719, '20', 2),
(45, 'COMBINATION BRACKET FOR G+20', 74531, '21', 2),
(46, 'COMBINATION BRACKET FOR G+21', 77344, '22', 2),
(47, 'COMBINATION BRACKET FOR G+22', 81563, '23', 2),
(48, 'COMBINATION BRACKET FOR G+23', 85813, '24', 2),
(49, 'COMBINATION BRACKET FOR G+24', 90063, '25', 2),
(50, 'COMBINATION BRACKET FOR G+25', 94313, '26', 2),

(51, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+26', 40125, '27', 1),
(52, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+27', 42000, '28', 1),
(53, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+28', 43875, '29', 1),
(54, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+29', 45750, '30', 1),
(55, 'CAR BRACKET & COUNTER WEIGHT BRACKET PAIR(GP BRACKET) G+30', 47625, '31', 1),

(56, 'COMBINATION BRACKET FOR G+26', 98563, '27', 2),
(57, 'COMBINATION BRACKET FOR G+27', 102813, '28', 2),
(58, 'COMBINATION BRACKET FOR G+28', 107063, '29', 2),
(59, 'COMBINATION BRACKET FOR G+29', 111313, '30', 2),
(60, 'COMBINATION BRACKET FOR G+30', 115563, '31', 2)
ON CONFLICT (id) DO NOTHING;





-- tbl_counter_weight - done
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (1, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 2, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (2, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 3, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (3, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 4, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (4, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 5, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (5, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 6, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (6, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 7, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (7, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 8, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (8, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 9, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (9, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 10, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (10, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 11, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (11, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 12, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (12, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 13, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (13, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 14, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (14, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 15, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (15, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 16, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (16, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 17, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (17, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 18, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (18, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 19, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (19, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 20, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (20, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 21, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (21, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 22, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (22, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 23, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (23, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 24, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (24, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 25, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (25, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 26, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (26, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 2, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (27, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 3, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (28, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 4, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (29, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 5, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (30, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 6, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (31, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 7, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (32, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 8, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (33, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 9, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (34, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 10, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (35, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 11, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (36, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 12, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (37, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 13, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (38, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 14, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (39, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 15, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (40, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 16, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (41, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 17, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (42, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 18, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (43, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 19, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (44, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 20, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (45, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 21, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (46, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 22, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (47, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 23, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (48, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 24, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (49, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 25, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (50, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 26, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (51, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 27, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (52, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 28, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (53, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 29, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (54, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 30, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (55, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 16 MM & 10 MM', 1, 31, 8500) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (56, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 27, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (57, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 28, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (58, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 29, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (59, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 30, 5375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_counter_weight (id,counter_weight_name, counter_weight_type, floors, price) VALUES (60, 'CAR & COUNTER WEIGHT GUIDE RAIL Â WITH HARDWARE 6 MM & 10 MM', 2, 31, 5375) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_counter_weight_id_seq', 60, true);

-- tbl_wire_rope - done
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (1, 2, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+1', 1, 1, 33 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (2, 3, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+2', 1, 1, 43.5 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (3, 4, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+3', 1, 1, 54 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (4, 5, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+4', 1, 1, 64.5 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (5, 6, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+5', 1, 1, 75 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (6, 7, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+6', 1, 1, 85.5 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (7, 8, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+7', 1, 1, 96 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (8, 9, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+8', 1, 1, 142 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (9, 10, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+9', 1, 1, 156 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (10, 11, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+10', 1, 1, 170 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (11, 12, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+11', 1, 1, 184 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (12, 13, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+12', 1, 1, 198 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (13, 14, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+13', 1, 1, 212 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (14, 15, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+14', 1, 1, 226 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (15, 16, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+15', 1, 1, 240 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (16, 17, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+16', 1, 1, 254 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (17, 18, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+17', 1, 1, 268 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (18, 19, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+18', 1, 1, 282 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (19, 20, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+19', 1, 1, 296 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (20, 21, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+20', 1, 1, 310 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (21, 22, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+21', 1, 1, 324 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (22, 23, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+22', 1, 1, 338 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (23, 24, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+23', 1, 1, 352 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (24, 25, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+24', 1, 1, 366 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (25, 26, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+25', 1, 1, 380 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (26, 2, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+1', 2, 1, 72 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (27, 3, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+2', 2, 1, 100 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (28, 4, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+3', 2, 1, 128 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (29, 5, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+4', 2, 1, 156 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (30, 6, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+5', 2, 1, 184 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (31, 7, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+6', 2, 1, 212 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (32, 8, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+7', 2, 1, 240 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (33, 9, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+8', 2, 1, 268 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (34, 10, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+9', 2, 1, 292 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (35, 11, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+10', 2, 1, 320 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (36, 12, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+11', 2, 1, 348 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (37, 13, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+12', 2, 1, 376 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (38, 14, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+13', 2, 1, 404 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (39, 15, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+14', 2, 1, 432 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (40, 16, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+15', 2, 1, 460 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (41, 17, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+16', 2, 1, 488 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (42, 18, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+17', 2, 1, 516 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (43, 19, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+18', 2, 1, 544 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (44, 20, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+19', 2, 1, 572 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (45, 21, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+20', 2, 1, 600 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (46, 22, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+21', 2, 1, 628 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (47, 23, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+22', 2, 1, 656 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (48, 24, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+23', 2, 1, 684 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (49, 25, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+24', 2, 1, 712 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (50, 26, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+25', 2, 1, 740 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (51, 2, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+1', 3, 2, 72 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (52, 3, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+2', 3, 2, 100 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (53, 4, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+3', 3, 2, 128 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (54, 5, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+4', 3, 2, 156 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (55, 6, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+5', 3, 2, 184 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (56, 7, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+6', 3, 2, 212 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (57, 8, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+7', 3, 2, 240 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (58, 9, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+8', 3, 2, 268 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (59, 10, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+9', 3, 2, 296 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (60, 11, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+10', 3, 2, 324 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (61, 12, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+11', 3, 2, 352 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (62, 13, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+12', 3, 2, 380 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (63, 14, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+13', 3, 2, 408 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (64, 15, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+14', 3, 2, 436 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (65, 16, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+15', 3, 2, 464 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (66, 17, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+16', 3, 2, 492 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (67, 18, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+17', 3, 2, 520 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (68, 19, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+18', 3, 2, 548 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (69, 20, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+19', 3, 2, 576 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (70, 21, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+20', 3, 2, 604 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (71, 22, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+21', 3, 2, 632 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (72, 23, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+22', 3, 2, 660 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (73, 24, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+23', 3, 2, 688 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (74, 25, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+24', 3, 2, 716 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (75, 26, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+25', 3, 2, 744 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (65, 16, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+15', 3, 2, 464 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (66, 17, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+16', 3, 2, 492 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (67, 18, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+17', 3, 2, 520 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (68, 19, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+18', 3, 2, 548 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (69, 20, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+19', 3, 2, 576 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (70, 21, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+20', 3, 2, 604 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (71, 22, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+21', 3, 2, 632 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (72, 23, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+22', 3, 2, 660 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (73, 24, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+23', 3, 2, 688 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (74, 25, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+24', 3, 2, 716 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (75, 26, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+25', 3, 2, 744 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (76, 2, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+1', 4, 3, 54 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (77, 3, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+2', 4, 3, 75 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (78, 4, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+3', 4, 3, 96 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (79, 5, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+4', 4, 3, 117 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (80, 6, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+5', 4, 3, 138 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (81, 7, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+6', 4, 3, 159 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (82, 8, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+7', 4, 3, 180 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (83, 9, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+8', 4, 3, 201 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (84, 10, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+9', 4, 3, 222 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (85, 11, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+10', 4, 3, 243 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (86, 12, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+11', 4, 3, 264 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (87, 13, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+12', 4, 3, 285 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (88, 14, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+13', 4, 3, 306 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (89, 15, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+14', 4, 3, 327 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (90, 16, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+15', 4, 3, 348 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (91, 17, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+16', 4, 3, 369 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (92, 18, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+17', 4, 3, 390 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (93, 19, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+18', 4, 3, 411 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (94, 20, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+19', 4, 3, 432 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (95, 21, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+20', 4, 3, 453 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (96, 22, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+21', 4, 3, 474 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (97, 23, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+22', 4, 3, 495 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (98, 24, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+23', 4, 3, 516 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (99, 25, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+24', 4, 3, 537 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (100, 26, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+25', 4, 3, 558 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (101, 27, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+26', 1, 1, 394 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (102, 28, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+27', 1, 1, 408 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (103, 29, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+28', 1, 1, 422 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (104, 30, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+29', 1, 1, 436 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (105, 31, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 1 ST 1 ROPING G+30', 1, 1, 450 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (106, 27, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+26', 2, 1, 768 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (107, 28, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+27', 2, 1, 796 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (108, 29, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+28', 2, 1, 820 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (109, 30, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+29', 2, 1, 824 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (110, 31, 'WIRE ROPE 13 MM  FOR GEARED MACHINE 2 ST 1 ROPING G+30', 2, 1, 824 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (111, 27, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+26', 3, 2, 772 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (112, 28, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+27', 3, 2, 780 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (113, 29, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+28', 3, 2, 828 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (114, 30, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+29', 3, 2, 856 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (115, 31, 'WIRE ROPE 8 MM  FOR GEARLESS MACHINE 2 ST 1 ROPING G+30', 3, 2, 884 , 81) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (116, 27, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+26', 4, 3, 579 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (117, 28, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+27', 4, 3, 600 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (118, 29, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+28', 4, 3, 621 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (119, 30, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+29', 4, 3, 642 , 131) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope (id, floor, wire_rope_name, wire_rope_type, machine_type, wire_rope_qty, price) VALUES (120, 31, 'WIRE ROPE 13 MM  FOR HYDRALIC MACHINE 2 ST 1 ROPING G+30', 4, 3, 663 , 131) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_wire_rope_id_seq', 120, true);

-- tbl_wire_rope_type - done
INSERT INTO tbl_wire_rope_type (id, wire_rope_type, machine_type, wire_rope_size) VALUES (1, '1:1', 1, 13) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope_type (id, wire_rope_type, machine_type, wire_rope_size) VALUES (2, '2:1', 1, 13) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope_type (id, wire_rope_type, machine_type, wire_rope_size) VALUES (3, '2:1', 2, 8) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope_type (id, wire_rope_type, machine_type, wire_rope_size) VALUES (4, '2:1', 3, 13) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_wire_rope_type (id, wire_rope_type, machine_type, wire_rope_size) VALUES (5, '3:1', 2, 30) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_wire_rope_type_seq', 5, true);

-- tbl_air_system --done
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (1, '04 Persons/272 Kg.', 2125, '1', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (2, '06 Persons/408 Kg. ', 2125, '1', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (3, '08 Persons/544 Kg. ', 2125, '1', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (4, '10 Persons/680 Kg. ', 2125, '1', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (5, '13 Persons/884 Kg. ', 4375, '1', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (6, '15 Persons/1020 Kg. ', 4375, '1', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (7, '20 Persons/1360 Kg.', 4375, '1', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (8, '25 Persons/1700 Kg.', 4375, '1', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (9, '30 Persons/2040 Kg.', 4375, '1', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (10, '04 Persons/272 Kg.', 2500, '2', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (11, '06 Persons/408 Kg.', 2750, '2', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (12, '08 Persons/544 Kg.', 5625, '2', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (13, '10 Persons/680 Kg.', 5625, '2', '2 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (14, '13 Persons/884 Kg.', 11000, '2', '4 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (15, '15 Persons/1020 Kg.', 11000, '2', '4 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (16, '20 Persons/1360 Kg.', 11000, '2', '4 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (17, '25 Persons/1700 Kg.', 12500, '2', '5 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (18, '30 Persons/2040 Kg.', 12500, '2', '5 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (19, '05 Persons/340 Kg. ', 2125, '1', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (20, '05 Persons/340 Kg. ', 2500, '2', '1 Set') ON CONFLICT (air_system_id) DO NOTHING;
INSERT INTO tbl_air_system (air_system_id, passenger, price, air_type, quantity) VALUES (21, '', 2500, '', '') ON CONFLICT (air_system_id) DO NOTHING;
SELECT setval('tbl_air_system_air_system_id_seq', 21, true);

-- tbl_new_counter_weight - done
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (1, 'COUNTER WEIGHT FOR 4 PASSENGER',1, 1, NULL,'392', 7350) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (2, 'COUNTER WEIGHT FOR 6 PASSENGER',1, 3,NULL, '588', 11025) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (3, 'COUNTER WEIGHT FOR 8 PASSENGER',1, 4, NULL,'784', 14700) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (4, 'COUNTER WEIGHT FOR 10 PASSENGER',1, 5,NULL, '980', 18375) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (5, 'COUNTER WEIGHT FOR 12 PASSENGER',1, 12,NULL, '1176', 22050) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (6, 'COUNTER WEIGHT FOR 13 PASSENGER',1, 6,NULL, '1274', 23888) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (7, 'COUNTER WEIGHT FOR 15 PASSENGER',1, 7,NULL, '1470', 27563) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (8, 'COUNTER WEIGHT FOR 18 PASSENGER',1, 11,NULL,  '1764', 33075) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (9, 'COUNTER WEIGHT FOR 20 PASSENGER',1, 8, NULL,'1960', 36750) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (10, 'COUNTER WEIGHT FOR 22 PASSENGER',1, 9,NULL,  '2156', 86240) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (11, 'COUNTER WEIGHT FOR 25 PASSENGER',1, 10,NULL,  '2450', 98000) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (12, 'COUNTER WEIGHT FOR 30 PASSENGER',1, 13,NULL, '2940', 117600) ON CONFLICT (id) DO NOTHING;
INSERT INTO tbl_new_counter_weight (id, new_counter_weight_name, capacity_type, person_capacity_id, weight_id, quantity, price) VALUES (15, 'COUNTER WEIGHT FOR 5 PASSENGER',1, 2,NULL, '392', 7350) ON CONFLICT (id) DO NOTHING;
SELECT setval('tbl_new_counter_weight_id_seq', 15, true);

-- -- Other statements
-- SELECT setval('tbl_cabin_subtype_id_seq', 158, true);
-- SELECT setval('tbl_other_material_id_seq', 64, true);
-- COMMIT;










-- default data

