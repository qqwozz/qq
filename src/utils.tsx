import { JSX } from 'react'

export function parseHtml(text: string): JSX.Element[] {
  const parts = text.split('\n\n')
  return parts.map((part, i) => {
    const segments: (string | JSX.Element)[] = []
    const regex = /<strong>(.*?)<\/strong>/g
    let lastIndex = 0
    let match

    while ((match = regex.exec(part)) !== null) {
      if (match.index > lastIndex) {
        segments.push(part.slice(lastIndex, match.index))
      }
      segments.push(<strong key={`b-${i}-${match.index}`}>{match[1]}</strong>)
      lastIndex = regex.lastIndex
    }

    if (lastIndex < part.length) {
      segments.push(part.slice(lastIndex))
    }

    return <p key={i}>{segments}</p>
  })
}

export function parseContactTitle(text: string): JSX.Element[] {
  const parts = text.split(/<br\s*\/?>/g)
  return parts.map((part, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {part}
    </span>
  ))
}
