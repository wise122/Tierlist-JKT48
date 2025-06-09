import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(
    import.meta.url);
const __dirname = path.dirname(__filename);

// Function to normalize names for comparison
function normalizeName(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z]/g, '') // Remove non-alphabetic characters
        .trim();
}

// Function to get all member files
function getMemberFiles() {
    const activeMembersPath = path.join(__dirname, 'asset', 'member_active');
    const exMembersPath = path.join(__dirname, 'asset', 'exmember');

    const activeMembers = fs.readdirSync(activeMembersPath)
        .filter(file => file.endsWith('.jpg'))
        .map(file => ({ file, path: path.join(activeMembersPath, file), isActive: true }));

    const exMembers = fs.readdirSync(exMembersPath)
        .filter(file => file.endsWith('.webp'))
        .map(file => ({ file, path: path.join(exMembersPath, file), isActive: false }));

    return [...activeMembers, ...exMembers];
}

// Main function to process the Excel file and match names
async function processMembers() {
    try {
        // Read the Excel file
        const workbook = XLSX.readFile('nama member jkt48.xlsx');
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(worksheet);

        console.log('Excel data loaded:', data.length, 'rows');

        // Get all member files
        const memberFiles = getMemberFiles();
        console.log('Found member files:', memberFiles.length);

        const matchedFiles = new Map();

        // Process each generation's data
        for (let i = 1; i <= 13; i++) {
            const genKey = `Gen${i}`;
            const genMembers = data.map(row => row[genKey]).filter(Boolean);
            console.log(`Processing ${genKey}:`, genMembers.length, 'members');

            genMembers.forEach(memberName => {
                const normalizedName = normalizeName(memberName);
                console.log(`Looking for match for: ${memberName} (${normalizedName})`);

                // Find matching file
                const matchingFile = memberFiles.find(file => {
                    const fileName = path.parse(file.file).name;
                    const normalizedFileName = normalizeName(fileName.replace(/_/g, ' '));
                    const isMatch = normalizedFileName.includes(normalizedName);
                    if (isMatch) {
                        console.log(`Found match: ${fileName} -> ${memberName}`);
                    }
                    return isMatch;
                });

                if (matchingFile) {
                    matchedFiles.set(matchingFile.file, {
                        generation: i,
                        originalPath: matchingFile.path,
                        isActive: matchingFile.isActive
                    });
                }
            });
        }

        // Generate rename operations
        const renameOperations = [];
        matchedFiles.forEach((info, fileName) => {
            const dir = info.isActive ? 'member_active' : 'exmember';
            const ext = info.isActive ? '.jpg' : '.webp';
            const baseName = fileName.replace(ext, '');
            const newName = `Gen${info.generation}_${baseName}${ext}`;
            const newPath = path.join(path.dirname(info.originalPath), newName);

            renameOperations.push({
                oldPath: info.originalPath,
                newPath: newPath,
                oldName: fileName,
                newName: newName
            });
        });

        // Write the rename operations to a JSON file for review
        fs.writeFileSync(
            'rename_operations.json',
            JSON.stringify(renameOperations, null, 2)
        );

        console.log(`Found ${renameOperations.length} matches.`);
        console.log('Rename operations have been saved to rename_operations.json');
        console.log('Please review the file before proceeding with the rename operation.');

        return renameOperations;
    } catch (error) {
        console.error('Error processing members:', error);
        throw error;
    }
}

// Execute the script
processMembers().catch(console.error);