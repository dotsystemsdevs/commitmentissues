export async function copyText(text: string): Promise<boolean> {
  if (!text) return false

  // Modern API (works on HTTPS + user gesture; can fail on iOS/Safari)
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch {
    // fall back below
  }

  // Fallback: textarea + execCommand('copy')
  try {
    if (typeof document === 'undefined') return false

    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', 'true')
    ta.style.position = 'fixed'
    ta.style.top = '0'
    ta.style.left = '0'
    ta.style.width = '1px'
    ta.style.height = '1px'
    ta.style.opacity = '0'
    ta.style.pointerEvents = 'none'
    ta.style.zIndex = '-1'
    document.body.appendChild(ta)

    ta.focus()
    ta.select()
    ta.setSelectionRange(0, ta.value.length)

    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch {
    return false
  }
}

export function promptCopy(text: string, label = 'Copy this'): void {
  try {
    // Works as a last resort on mobile/desktop.
    window.prompt(label, text)
  } catch {
    // ignore
  }
}

