'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import UtilsLayout from '@/components/layout/UtilsLayout'

export default function Component() {
    const [csvData, setCsvData] = useState<string[][]>([])
    const [sortedData, setSortedData] = useState<string[][]>([])
    const [headers, setHeaders] = useState<string[]>([])
    const [sortColumn, setSortColumn] = useState<string>('')
    const [sortColumnIndex, setSortColumnIndex] = useState<number>(1)
    const [secondarySortColumns, setSecondarySortColumns] = useState<string>('')
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
    const [caseSensitive, setCaseSensitive] = useState<boolean>(false)
    const [sortMethod, setSortMethod] = useState<'alphabetical' | 'numeric'>('alphabetical')
    const [handleMissingValues, setHandleMissingValues] = useState<'unchanged' | 'blank' | 'custom'>('unchanged')
    const [customMissingValue, setCustomMissingValue] = useState<string>('')
    const [deleteComments, setDeleteComments] = useState<boolean>(false)
    const [commentSymbol, setCommentSymbol] = useState<string>('#')
    const [deleteEmptyLines, setDeleteEmptyLines] = useState<boolean>(false)
    const [fileName, setFileName] = useState<string>('')

    const parseCSV = (text: string): string[][] => {
        const rows = text.split(/\r?\n/).filter(row => {
            if (deleteEmptyLines && row.trim() === '') return false
            if (deleteComments && row.trim().startsWith(commentSymbol)) return false
            return true
        })
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
                setHeaders(rows[0])
                setSortedData(rows.slice(1))
            }
            reader.readAsText(file)
        }
    }

    const sortData = useCallback(() => {
        const dataToSort = [...sortedData]
        const columnIndex = sortColumn ? headers.indexOf(sortColumn) : sortColumnIndex - 1
        const secondaryIndices = secondarySortColumns.split(',').map(col => headers.indexOf(col.trim()))

        const compareFunction = (a: string[], b: string[]) => {
            const compareValues = (valA: string, valB: string) => {
                if (handleMissingValues !== 'unchanged') {
                    if (valA === '') valA = handleMissingValues === 'custom' ? customMissingValue : ' '
                    if (valB === '') valB = handleMissingValues === 'custom' ? customMissingValue : ' '
                }

                if (sortMethod === 'numeric') {
                    return Number(valA) - Number(valB)
                } else {
                    return caseSensitive ? valA.localeCompare(valB) : valA.toLowerCase().localeCompare(valB.toLowerCase())
                }
            }

            let comparison = compareValues(a[columnIndex], b[columnIndex])
            if (comparison === 0) {
                for (let secondaryIndex of secondaryIndices) {
                    if (secondaryIndex !== -1) {
                        comparison = compareValues(a[secondaryIndex], b[secondaryIndex])
                        if (comparison !== 0) break
                    }
                }
            }
            return sortOrder === 'asc' ? comparison : -comparison
        }

        dataToSort.sort(compareFunction)
        setSortedData(dataToSort)
    }, [caseSensitive, customMissingValue, handleMissingValues, headers, secondarySortColumns, sortColumn, sortColumnIndex, sortMethod, sortOrder, sortedData])

    useEffect(() => {
        if (csvData.length > 0) {
            sortData()
        }
    }, [csvData.length, sortData])

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
        const csvContent = convertToCSV([headers, ...sortedData])
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
        <UtilsLayout>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Advanced CSV Sorter</h1>
                <Input type="file" accept=".csv" onChange={handleFileUpload} />
                {csvData.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="sortColumn">Sort Column</Label>
                                <Select onValueChange={(value) => setSortColumn(value)}>
                                    <SelectTrigger id="sortColumn">
                                        <SelectValue placeholder="Select column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {headers.map((header, index) => (
                                            <SelectItem key={index} value={header}>{header}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="sortColumnIndex">Column Position</Label>
                                <Input
                                    id="sortColumnIndex"
                                    type="number"
                                    min="1"
                                    max={headers.length}
                                    value={sortColumnIndex}
                                    onChange={(e) => setSortColumnIndex(Number(e.target.value))}
                                />
                            </div>
                            <div>
                                <Label htmlFor="secondarySortColumns">Secondary Sort Columns</Label>
                                <Input
                                    id="secondarySortColumns"
                                    value={secondarySortColumns}
                                    onChange={(e) => setSecondarySortColumns(e.target.value)}
                                    placeholder="e.g. column1, column2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="sortOrder">Sort Order</Label>
                                <Select onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                                    <SelectTrigger id="sortOrder">
                                        <SelectValue placeholder="Select order" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="asc">Ascending</SelectItem>
                                        <SelectItem value="desc">Descending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="sortMethod">Sort Method</Label>
                                <Select onValueChange={(value: 'alphabetical' | 'numeric') => setSortMethod(value)}>
                                    <SelectTrigger id="sortMethod">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="alphabetical">Alphabetical</SelectItem>
                                        <SelectItem value="numeric">Numeric</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="caseSensitive"
                                    checked={caseSensitive}
                                    onCheckedChange={(checked: boolean) => setCaseSensitive(checked)}
                                />
                                <Label htmlFor="caseSensitive">Case-sensitive Sort</Label>
                            </div>
                            <div>
                                <Label htmlFor="handleMissingValues">Handle Missing Values</Label>
                                <Select onValueChange={(value: 'unchanged' | 'blank' | 'custom') => setHandleMissingValues(value)}>
                                    <SelectTrigger id="handleMissingValues">
                                        <SelectValue placeholder="Select method" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="unchanged">Unchanged</SelectItem>
                                        <SelectItem value="blank">Blank</SelectItem>
                                        <SelectItem value="custom">Custom</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {handleMissingValues === 'custom' && (
                                <div>
                                    <Label htmlFor="customMissingValue">Custom Missing Value</Label>
                                    <Input
                                        id="customMissingValue"
                                        value={customMissingValue}
                                        onChange={(e) => setCustomMissingValue(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="deleteComments"
                                    checked={deleteComments}
                                    onCheckedChange={(checked: boolean) => setDeleteComments(checked)}
                                />
                                <Label htmlFor="deleteComments">Delete Comments</Label>
                            </div>
                            {deleteComments && (
                                <div>
                                    <Label htmlFor="commentSymbol">Comment Symbol</Label>
                                    <Input
                                        id="commentSymbol"
                                        value={commentSymbol}
                                        onChange={(e) => setCommentSymbol(e.target.value)}
                                    />
                                </div>
                            )}
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="deleteEmptyLines"
                                    checked={deleteEmptyLines}
                                    onCheckedChange={(checked: boolean) => setDeleteEmptyLines(checked)}
                                />
                                <Label htmlFor="deleteEmptyLines">Delete Empty Lines</Label>
                            </div>
                        </div>
                        <Button onClick={downloadCSV}>Download Sorted CSV</Button>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    {headers.map((header, index) => (
                                        <TableHead key={index}>{header}</TableHead>
                                    ))}
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedData.slice(0, 10).map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        {row.map((cell, cellIndex) => (
                                            <TableCell key={cellIndex}>{cell}</TableCell>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        {sortedData.length > 10 && (
                            <p className="text-center text-gray-500">Showing first 10 rows of {sortedData.length} total rows</p>
                        )}
                    </>
                )}
            </div>
        </UtilsLayout>
    )
}