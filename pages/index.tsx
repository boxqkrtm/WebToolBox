'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function Component() {
  const [csvData, setCsvData] = useState<string[][]>([])
  const [sortedData, setSortedData] = useState<string[][]>([])
  const [fileName, setFileName] = useState<string>('')

  const parseCSV = (text: string): string[][] => {
    const rows = text.split(/\r?\n/).filter(row => row.trim() !== '')
    return rows.map(row => {
      const fields = []
      let field = ''
      let inQuotes = false
      for (let i = 0; i < row.length; i++) {
        if (row[i] === '"') {
          if (inQuotes && row[i + 1] === '"') {
            field += '"'
            i++
          } else {
            inQuotes = !inQuotes
          }
        } else if (row[i] === ',' && !inQuotes) {
          fields.push(field)
          field = ''
        } else {
          field += row[i]
        }
      }
      fields.push(field)
      return fields
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (e) => {
        const text = e.target?.result as string
        const rows = parseCSV(text)
        setCsvData(rows)
        sortData(rows.slice(1)) // Exclude header row
      }
      reader.readAsText(file)
    }
  }

  const sortData = (data: string[][]) => {
    const sorted = [...data].sort((a, b) => {
      for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) {
          return b[i].localeCompare(a[i], undefined, { numeric: true, sensitivity: 'base' }) // Descending order
        }
      }
      return 0
    })
    setSortedData(sorted)
  }

  const convertToCSV = (data: string[][]): string => {
    return data.map(row =>
      row.map(cell => {
        if (cell.includes('"') || cell.includes(',') || cell.includes('\n')) {
          return `"${cell.replace(/"/g, '""')}"`
        }
        return cell
      }).join(',')
    ).join('\n')
  }

  const downloadCSV = () => {
    if (csvData.length === 0 || sortedData.length === 0) {
      console.error('No data to download')
      return
    }
    const csvContent = convertToCSV([csvData[0], ...sortedData])
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `sorted_${fileName || 'data.csv'}`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold">CSV Sorter</h1>
      <Input type="file" accept=".csv" onChange={handleFileUpload} />
      {csvData.length > 0 && (
        <>
          <Button onClick={downloadCSV}>Download Sorted CSV</Button>
          <Table>
            <TableHeader>
              <TableRow>
                {csvData[0].map((header, index) => (
                  <TableHead key={index}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  )
}