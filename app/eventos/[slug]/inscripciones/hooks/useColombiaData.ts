import { useState, useEffect } from "react";

interface Departamento {
  id: number;
  departamento: string;
  ciudades: string[];
}

export function useColombiaData() {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadColombiaData = async () => {
      try {
        const response = await fetch("/colombia.min.json");
        const data = await response.json();
        setDepartamentos(data);
      } catch (error) {
        console.error("Error loading Colombia data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadColombiaData();
  }, []);

  const getDepartamentosByName = () => {
    return departamentos.map((dept) => ({
      value: dept.departamento.toLowerCase(),
      label: dept.departamento,
      id: dept.id,
    }));
  };

  const getMunicipiosByDepartamento = (departamentoName: string) => {
    const dept = departamentos.find(
      (d) => d.departamento.toLowerCase() === departamentoName.toLowerCase(),
    );
    return dept
      ? dept.ciudades.map((ciudad) => ({
          value: ciudad.toLowerCase(),
          label: ciudad,
        }))
      : [];
  };

  return {
    loading,
    departamentos: getDepartamentosByName(),
    getMunicipiosByDepartamento,
  };
}
