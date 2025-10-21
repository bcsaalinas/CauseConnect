import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const csvPath = path.join(__dirname, '../../../Inventario_Federal_2023.csv');

let federalPrograms = [];
let focusAreas = [];

try {
  // Read and parse the CSV file
  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true
  });

  console.log('CSV records loaded:', records.length);

  // Transform the data for our needs
  federalPrograms = records.map(record => ({
    id: record.PFR_RMC_A,
    name: record.PRF_DG_NOMBRE,
    acronym: record.PRF_DG_ACRONIMO,
    description: record.PRF_DO_OBJETIVO_GENERAL,
    startYear: record.PRF_DG_ANIO_INICIO,
    operationYear: record.PRF_DG_ANIO_OPERACION,
    responsible: record.PRF_DG_RESPONSABLE_B,
    phone: record.PRF_DG_TELEFONO,
    email: record.PRF_DG_CORREO,
    focusArea: record.PRF_DER_DESCRIPCION_D,
    supportType: record.PRF_P_APOYOS,
    requirements: record.PRF_P_REQUISITOS,
    website: record.PRF_DO_VINCULO
  }));

  // Extract unique focus areas
  focusAreas = [...new Set(federalPrograms.map(p => p.focusArea))].filter(area => area && area !== 'NA');
  console.log('Focus areas loaded:', focusAreas);

} catch (error) {
  console.error('Error loading federal programs:', error);
}


// Function to get paginated results
export function getPaginatedPrograms(page = 1, limit = 10, filters = {}) {
  console.log('Getting paginated programs with:', { page, limit, filters });
  console.log('Total federal programs available:', federalPrograms.length);
  
  if (federalPrograms.length === 0) {
    console.log('No federal programs loaded');
    return {
      programs: [],
      currentPage: 1,
      totalPages: 0,
      totalItems: 0,
      itemsPerPage: limit
    };
  }
  
  const { search = '', focusArea = '' } = filters;
  
  // Apply filters
  let filteredPrograms = [...federalPrograms];
  
  if (search) {
    const searchTerm = search.toLowerCase();
    filteredPrograms = filteredPrograms.filter(program => 
      program.name.toLowerCase().includes(searchTerm) ||
      (program.description && program.description.toLowerCase().includes(searchTerm))
    );
    console.log('After search filter:', filteredPrograms.length, 'programs');
  }
  
  if (focusArea) {
    filteredPrograms = filteredPrograms.filter(program => 
      program.focusArea === focusArea
    );
    console.log('After focus area filter:', filteredPrograms.length, 'programs');
  }
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const totalPages = Math.ceil(filteredPrograms.length / limit);
  
  // Get the programs for the current page
  const paginatedResults = filteredPrograms.slice(startIndex, endIndex);
  console.log('Paginated results:', {
    currentPage: page,
    totalPages,
    totalItems: filteredPrograms.length,
    itemsPerPage: limit,
    resultsInPage: paginatedResults.length
  });
  
  return {
    programs: paginatedResults,
    currentPage: page,
    totalPages,
    totalItems: filteredPrograms.length,
    itemsPerPage: limit
  };
}

// Get unique focus areas for filtering
export function getUniqueFocusAreas() {
  return [...new Set(federalPrograms.map(program => program.focusArea))]
    .filter(area => area && area !== 'NA');
}