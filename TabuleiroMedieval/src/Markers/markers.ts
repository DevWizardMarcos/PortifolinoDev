import * as THREE from "three";

interface Reino {
  nome: string;
  posicao: [number, number];
}

export const reinos: Reino[] = [
  { nome: "Danki Code", posicao: [-2.9, -4.2] },
  { nome: "MS Negocios", posicao: [-0.4, -4.2] },
  { nome: "Infinity School", posicao: [2.8, -3.5] },
  { nome: "Dreams", posicao: [-3.4, 2.0] },
  { nome: "CNX", posicao: [2.0, 2.0] },
];

export function createMakers(): THREE.Group {
  const grupo = new THREE.Group();

  for (const reino of reinos) {
    const geometry = new THREE.ConeGeometry(0.5, 1.2, 8);
    const material = new THREE.MeshStandardMaterial({ color: 0x9b59b6 });
    const marker = new THREE.Mesh(geometry, material);
    marker.position.set(reino.posicao[0], 0.6, reino.posicao[1]);
    marker.name = reino.nome;
    grupo.add(marker);
  }

  return grupo;
}


export function createCentralTree(): THREE.Mesh{
    const geometry = new THREE.ConeGeometry(0.8,2,8)
    const material = new THREE.MeshStandardMaterial({color: 0x2e7d32})
    const three = new THREE.Mesh(geometry,material)
    three.position.set(-0.4,1,0.8)
    three.name = 'Nucleo da Criação'
    return three 
}





