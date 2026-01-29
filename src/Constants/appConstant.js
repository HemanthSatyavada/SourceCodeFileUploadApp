export const DEFAULT_USER = 'USER';
export const COVER_USER = 'COVER_USER';
export const ADMIN_USER = 'SUPER_USER';
export const NICHE_USER = 'NICHE_USER';
export const ALLOWED_EXTENSIONS_FOR_CMS_UPLOAD = ["zip", "pdf", "iso", "md5", "docx", "doc", "jpg", "indd", "idml", "epub", "prc", "mobi", "azw", "xml", "mp3"];
export const COVER_FILE_PATTERNS = [
    /^\d{13}_cover\.pdf$/i,
    /^\d{13}_jacket\.pdf$/i,
    /^\d{13}_spine\.pdf$/i,
    /^\d{13}_coverf\.pdf$/i,
    /^\d{13}_endpaper\.pdf$/i,
    /^\d{13}_back_endpaper\.pdf$/i,
    /^\d{13}_front_endpaper\.pdf$/i,
    /^\d{13}_inside_cover\.pdf$/i,
    /^\d{13}_inside_back_cover\.pdf$/i,
    /^\d{13}_inside_front_cover\.pdf$/i,
    /^\d{13}_spine_foil\.pdf$/i,
    /^\d{13}_cover_foil\.pdf$/i,
    /^\d{13}_cover_crusher\.pdf$/i,
    /^\d{13}_spine_crusher\.pdf$/i,
    /^\d{13}_jacket_spotuv\.pdf$/i,
    /^\d{13}_spotuv\.pdf$/i,
    /^\d{13}_emboss\.pdf$/i,
    /^\d{13}_coversheet\.pdf$/i
  ];
  
  export const ARTWORK_FILE_PATTERNS = [
    /^\d{13}\.jpg$/i,
    /^\d{13}_cover_artwork\.zip$/i,
    /^\d{13}_cover\.indd$/i,
    /^\d{13}_coverf\.indd$/i
  ];


  // export const NICHE_FILE_PATTERNS = [
  //   /^\d{13}_print\.zip$/i,
  //   /^\d{13}_xml\.zip$/i,
  //   /^\d{13}_application_files\.zip$/i,
  //   /^\d{13}_covers\.zip$/i,
  //   /^\d{13}_cover\.pdf$/i,
  //   /^\d{13}_text\.pdf$/i,
  //   /^\d{13}\.jpg$/i
  // ];

  export let NICHE_FILE_UPLOAD_LIMIT = 5;
  export let NICHE_FILE_SIZE_LIMIT = 2;