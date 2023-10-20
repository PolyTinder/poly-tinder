export const PROGRAMS = {
    bacc_aero: 'Génie aérospatial',
    bacc_bio: 'Génie biomédical',
    bacc_chim: 'Génie chimique',
    bacc_civ: 'Génie civil',
    bacc_mine: 'Génie des mines',
    bacc_ele: 'Génie électrique',
    bacc_geo: 'Génie géologique',
    bacc_ind: 'Génie industriel',
    bacc_info: 'Génie informatique',
    bacc_log: 'Génie logiciel',
    bacc_meca: 'Génie mécanique',
    bacc_phys: 'Génie physique',
    mat_dd: 'Maîtrise développement durable',
    mat_ergo: 'Maîtrise ergonomie et ergonomie du logiciel',
    mat_aero: 'Maîtrise génie aérospatial',
    mat_bio: 'Maîtrise génie biomédical',
    mat_chim: 'Maîtrise génie chimique',
    mat_civ: 'Maîtrise génie civil',
    mat_mat: 'Maîtrise génie des matériaux',
    mat_ele: 'Maîtrise génie électrique',
    mat_eners: 'Maîtrise génie énergétique et nucléaire',
    mat_ind: 'Maîtrise génie industriel',
    mat_infolog: 'Maîtrise génie informatique et génie logiciel',
    mat_meca: 'Maîtrise génie mécanique',
    mat_mine: 'Maîtrise génie minéral',
    mat_phys: 'Maîtrise génie physique',
    mat_math: 'Maîtrise mathématiques',
    mat_tech: 'Maîtrise technologie',
    other_cert_micro: 'Certificats et microprogrammes de 1e cycle',
    other_form_cont: 'Formation continue',
    other_dd_hec: 'Double diplôme HEC Montréal (Baccalauréat)',
};

export const PROGRAMS_ARRAY = Object.entries(PROGRAMS).map(([id, name]) => ({
    id,
    name,
}));

export const PROGRAMS_CATEGORY = {
    bacc: 'Baccalauréat',
    mat: 'Maîtrise',
    other: 'Autres',
};
