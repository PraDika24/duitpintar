import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

// Buat SVG sederhana sebagai source icon
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" rx="96" fill="#059669"/>
  <text x="256" y="340" font-size="280" text-anchor="middle" fill="white" font-family="Arial">₿</text>
</svg>
`

const svgBuffer = Buffer.from(svg)

await sharp(svgBuffer).resize(192, 192).png().toFile('public/icons/icon-192.png')
await sharp(svgBuffer).resize(512, 512).png().toFile('public/icons/icon-512.png')

console.log(' Icons generated!')