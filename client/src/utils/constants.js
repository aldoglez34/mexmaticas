export const APP_VERSION = "8.0";

export const IMAGES = {
  SIZE: 1000000,
  SUPPORTED_FORMATS: ["image/jpg", "image/jpeg", "image/gif", "image/png"],
};

export const PDFS = {
  SIZE: 4000000,
  SUPPORTED_FORMATS: ["application/pdf"],
};

export const USERS = {
  ADMIN: "Admin",
  GUEST: "Guest",
  STUDENT: "Student",
  TEACHER: "Teacher",
};

export const ADMIN_PAGES = {
  CLASSROOMS: {
    PAGE_SIZE: 15,
    SORT_OPTIONS: [
      "Más Recientes",
      "Más Antiguos",
      "Por Nombre Asc",
      "Por Nombre Desc",
    ],
    FILTER_BUTTONS: ["Primaria", "Secundaria", "Preparatoria", "Universidad"],
  },
  INSTITUTIONS: {
    PAGE_SIZE: 15,
    SORT_OPTIONS: [
      "Más Recientes",
      "Más Antiguos",
      "Por Nombre Asc",
      "Por Nombre Desc",
    ],
  },
  MESSAGES: {
    PAGE_SIZE: 15,
  },
  STUDENTS: {
    PAGE_SIZE: 15,
    SORT_OPTIONS: [
      "Más Recientes",
      "Más Antiguos",
      "Por Nombre Asc",
      "Por Nombre Desc",
      "Por Email Asc",
      "Por Email Desc",
    ],
  },
  TEACHERS: {
    PAGE_SIZE: 15,
    SORT_OPTIONS: [
      "Más Recientes",
      "Más Antiguos",
      "Por Nombre Asc",
      "Por Nombre Desc",
      "Por Email Asc",
      "Por Email Desc",
    ],
  },
};
