/**
 * Shared project data used by both the projects page and the terminal easter egg.
 */
export interface Project {
  key: string
  tech: string[]
}

export const projects: Project[] = [
  { key: 'pillPal', tech: ['Kotlin', 'Android', 'Jetpack', 'SQLite'] },
  { key: 'tuningSchweiz', tech: ['Flutter', 'Dart', 'Laravel', 'Firebase', 'Angular'] },
  { key: 'businessSystem', tech: ['C#', 'Blazor', 'WPF', 'SQL Server'] },
  { key: 'vrElevator', tech: ['Unity 6', 'C#', 'Meta Quest 3'] },
  { key: 'dogCamera', tech: ['Raspberry Pi', 'Python', 'Discord API'] },
  { key: 'mappli', tech: ['Next.js', 'React', 'TypeScript', 'PostgreSQL'] },
  { key: 'syncShift', tech: ['Flutter', 'Dart', 'Android', 'iOS'] },
  { key: 'clientWebsites', tech: ['WordPress', 'Angular', 'PHP', 'CSS'] },
]

/**
 * Project titles for the terminal (no i18n dependency).
 * Keys match the translation keys in messages/{locale}.json → projects.{key}.title
 */
export const projectTitles: Record<string, string> = {
  pillPal: 'PillPal',
  tuningSchweiz: 'Tuning Schweiz App',
  businessSystem: 'Business Management System',
  vrElevator: 'VR Marketing Experience',
  dogCamera: 'Pomsky Cam',
  mappli: 'Mappli',
  syncShift: 'SyncShift',
  clientWebsites: 'Client Websites',
}
