import * as path from 'path';
import * as xlsx from 'xlsx';
import * as fs from 'fs';

const SOURCE_FILE_PATH = "D:/farmer/px-api/src/source";
const DIST_FILE_PATH = "D:/farmer/px-api/src/report";

export const convertExcelFileToJson = (date: string) => {
    const sourceFileName = date + '.xlsx';
    const sourceFilePath = path.join(SOURCE_FILE_PATH, sourceFileName);

    // Read the file using pathname
    const file = xlsx.readFile(sourceFilePath);
    // Grab the sheet info from the file
    const sheetNames = file.SheetNames;
    const totalSheets = sheetNames.length;
    // Variable to store our data 
    let parsedData = [];
    // Loop through sheets
    for (let i = 0; i < totalSheets; i++) {
        // Convert to json using xlsx
        const tempData = xlsx.utils.sheet_to_json(file.Sheets[sheetNames[i]]);
        // Skip header row which is the colum names
        tempData.shift();
        // Add the sheet's json to our data array
        parsedData.push(...tempData);
    }

    return parsedData;
}

export const generateReportJSONFile = (report: any, fileName: string) => {
    const distFilePath = path.join(DIST_FILE_PATH, fileName);

    try {
        fs.writeFileSync(distFilePath, JSON.stringify(report))
    } catch (err) {
        console.error(err)
    }
}