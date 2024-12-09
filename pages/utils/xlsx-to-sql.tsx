'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import * as XLSX from 'xlsx'

export default function Component() {
    const [sqlStatements, setSqlStatements] = useState<string>('')

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const data = new Uint8Array(e.target?.result as ArrayBuffer)
                const workbook = XLSX.read(data, { type: 'array' })

                // Process all sheets
                const allStatements = workbook.SheetNames.map(sheetName => {
                    const sheet = workbook.Sheets[sheetName]
                    const jsonData = XLSX.utils.sheet_to_json(sheet)

                    if (jsonData.length === 0) return ''

                    const columns = Object.keys(jsonData[0] as Record<string, any>)
                    const tableName = sheetName.toLowerCase().replace(/\s+/g, '_')

                    const insertStatements = jsonData.map(row => {
                        const values = columns.map(col => {
                            const value = (row as any)[col]
                            if (value === null || value === undefined) return 'NULL'
                            if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`
                            return value
                        }).join(', ')

                        return `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values});`
                    }).join('\n')

                    return `-- Table: ${sheetName}\n${insertStatements}\n`
                }).join('\n')

                setSqlStatements(allStatements)
            }
            reader.readAsArrayBuffer(file)
        }
    }

    const handleCopy = () => {
        navigator.clipboard.writeText(sqlStatements)
    }

    return (
        <div className="container mx-auto p-4 space-y-4">
            <h1 className="text-2xl font-bold">XLSX to SQL Converter</h1>

            <div className="space-y-2">
                <Label htmlFor="file">Upload XLSX File</Label>
                <Input
                    id="file"
                    type="file"
                    accept=".xlsx, .xls"
                    onChange={handleFileUpload}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="sql">Generated SQL Statements</Label>
                <Textarea
                    id="sql"
                    value={sqlStatements}
                    readOnly
                    className="min-h-[300px] font-mono"
                />
            </div>

            {sqlStatements && (
                <Button onClick={handleCopy}>
                    Copy to Clipboard
                </Button>
            )}
        </div>
    )
}