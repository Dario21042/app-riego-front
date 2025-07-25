// utils/roles.js
export const ROLE_LABELS = {
  1: 'Administrador',
  2: 'Presidente',
  3: 'Secretario',
  4: 'Tesorero',
};


export function getRoleName(rol) {
  const key = parseInt(rol, 10);
  return ROLE_LABELS[key] || 'Usuario';
}
