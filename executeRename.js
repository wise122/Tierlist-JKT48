import fs from 'fs';
import path from 'path';

async function executeRename() {
    try {
        // Read the rename operations
        const operations = JSON.parse(
            fs.readFileSync('rename_operations.json', 'utf8')
        );

        console.log(`Found ${operations.length} rename operations to execute.`);

        // Execute each rename operation
        for (const op of operations) {
            console.log(`Renaming: ${op.oldName} -> ${op.newName}`);
            fs.renameSync(op.oldPath, op.newPath);
        }

        console.log('All files have been renamed successfully!');
    } catch (error) {
        console.error('Error executing rename operations:', error);
        throw error;
    }
}

// Execute the script
executeRename().catch(console.error);