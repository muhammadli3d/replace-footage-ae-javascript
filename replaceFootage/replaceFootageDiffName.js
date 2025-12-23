/*
replaceFootageDiffName.js
- Script for replace multiple footage with different name that have same parent 
  folder path. Suitable for AOV's render workflow
- https://github.com/muhammadli3d
- 2025-12-23

--------------------------------------------------------------------------------
1. Run script in After Effects
2. Paste path in pop-up window
3. Enter the text want to replace
4. Then enter the new text
--------------------------------------------------------------------------------
*/


(function replaceFootageSequence() {
	var project = app.project;
	var selectedItems = project.selection;
	
	if (selectedItems.length === 0) {
		alert("Please select the footage in Project window you want to replace.");
		return;
	}
	
	var latestFolderPath = prompt("Please paste the path's folder of latest render:", "");
	
	if (latestFolderPath === null || latestFolderPath === "") {
		alert("No folder path provided.");
		return;
	}
	
	var oldPrefix = prompt("Please enter the old prefix (e.g: 'scene01'):", "");
	if (oldPrefix === null || oldPrefix === "") {
		alert("No old prefix provided.")
		return;
	}
	
	var newPrefix = prompt("Please enter the new prefix (e.g: 'scene02'):", "");
	if (newPrefix === null || newPrefix === "") {
			alert("No new prefix provided.");
			return;
	}
	
	var latestFolder = new Folder(latestFolderPath);
	
	if (!latestFolder.exists) {
		alert("The specified folder does not exist.");
		return;
	}
	
	app.beginUndoGroup("Replace Footage Items");
	
	var replacements = {};
	
	function findRenderFolders(folder) {
			var subfolders = folder.getFiles(function(file) {
				return file instanceof Folder;
			});
			
			for (var i = 0; i < subfolders.length; i++) {
				var subfolder = subfolders[i];
				var files = subfolder.getFiles(function(file) {
					return file instanceof File && file.name.match(/\d{4}\.\w+$/i); // Match only the sequence files (e.g 0000.*, 0001.*)
				});
				
				if (files .length > 0) {
					var sequenceName = files[0].name.replace(/\d{4}(\.\w+)$/, "####$1");
					var firstFilePath = files[0].fsName;
					replacements[sequenceName] = firstFilePath;
					$.writeln("Found sequence: " + sequenceName + " at path: " + firstFilePath); // Debug output
				}
				
				// Recursively search in subfolders
				findRenderFolders(subfolder);
			}
	}
	
	findRenderFolders(latestFolder);
	
	for (var i = 0; i < selectedItems.length; i++) {
		if (selectedItems[i] instanceof FootageItem) {
			var oldFootageName = selectedItems[i].mainSource.file.name.replace(/\d{4}(\.\w+)$/, "####$1");
			oldFootageName = oldFootageName.replace(oldPrefix, newPrefix);
			var newFootageFile = replacements[oldFootageName];
			
			$.writeln("Trying to replace: " + oldFootageName); // Debug output
			
			if (newFootageFile) {
				var newFile = new File(newFootageFile);
				selectedItems[i].replaceWithSequence(newFile, false); // Set the second parameter to true if want to force alphabetical order
				$.writeln("Replace with: " + newFootageFile); // Debug output
			} else {
				alert("Replacement sequence not found for: " + oldFootageName);
				$.writeln("Replacement seqeunce not found for: " + oldFootageName); // Debug output
			}
		}
	}
	
	app.endUndoGroup();
	
	alert("Footage replacement complete.")
})();
