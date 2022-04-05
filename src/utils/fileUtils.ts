import * as path from 'path';
import * as xlsx from 'xlsx';
import * as fs from 'fs';
import axios from 'axios';

const SOURCE_FILE_PATH = "D:/farmer/px-api/src/source";
const DIST_FILE_PATH = "D:/farmer/px-api/src/report";
const ANALYSIS_FILE_PATH = "D:/farmer/px-api/src/report/analysis";

// unuse
export const convertExcelFileToJson = (sourceFilePath: string): any => {

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

export const generateProductAnalysisJSONFile = (data: any, date: number) => {
    const fileName = date + '.json'
    const distFilePath = path.join(DIST_FILE_PATH, fileName);
}

export const getSalesItemJSON = () => {
    const fileName = 'salesItem.json';
    const filePath = path.join(SOURCE_FILE_PATH, fileName);
    return getJsonFile(filePath);
}

export const getSellerData = () => {
    const filePath = path.join("C:/papago/px-api/src/report", "sellersReport.json");
    return getJsonFile(filePath);
}

export const generateJsonFile = (path: string, data: any) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data))
    } catch (err) {
        console.error(err)
    }
}

export const parseBufferToJson = (data: any) => {
    const file = xlsx.read(data, { type: 'buffer' });
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

export const fetchXlsxFile = async (requestUrl: string) => {
    const res = await axios({
        url: requestUrl,
        responseType: 'arraybuffer',
        method: 'get',
        headers: {
            'Content-Type': 'blob',
        }
    });

    return res.data;
}

// unuse
const getJsonFile = (filePath: string) => {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}