(function replaceFootageWithParentFolderEXR() {
    var project = app.project;
    var selectedItems = project.selection;

    if (selectedItems.length === 0) {
        alert("Please select the footage items you want to replace.");
        return;
    }

    var parentFolderPath = prompt("Please paste the path of the parent folder containing the replacement subfolders", "");

    if (parentFolderPath === null || parentFolderPath === "") {
        alert("No parent folder path provided.");
        return;
    }

    var parentFolder = new Folder(parentFolderPath);

    if (!parentFolder.exists) {
        alert("The specified parent folder does not exist.");
        return;
    }

    app.beginUndoGroup("Replace Footage Items");

    var subfolders = parentFolder.getFiles(function(file) {
        return file instanceof Folder;
    });

    var replacements = {};

    for (var i = 0; i < subfolders.length; i++) {
        var subfolder = subfolders[i];
        var files = subfolder.getFiles(function(file) {
            return file instanceof File && file.name.match(/\d{4}\.exr$/i);  // Match only the sequence files (e.g., 0000.exr, 0001.exr)
        });

        if (files.length > 0) {
            var sequenceName = files[0].name.replace(/\d{4}\.exr$/, "####.exr");
            var firstFilePath = files[0].fsName;
            replacements[sequenceName] = firstFilePath;
            $.writeln("Found sequence: " + sequenceName + " at path: " + firstFilePath);  // Debug output
        }
    }

    for (var i = 0; i < selectedItems.length; i++) {
        if (selectedItems[i] instanceof FootageItem) {
            var oldFootageName = selectedItems[i].mainSource.file.name.replace(/\d{4}\.exr$/, "####.exr");
            var newFootageFile = replacements[oldFootageName];

            $.writeln("Trying to replace: " + oldFootageName);  // Debug output

            if (newFootageFile) {
                var newFile = new File(newFootageFile);
                selectedItems[i].replaceWithSequence(newFile, false);  // Set the second parameter to true if you want to force alphabetical order
                $.writeln("Replaced with: " + newFootageFile);  // Debug output
            } else {
                alert("Replacement sequence not found for: " + oldFootageName);
                $.writeln("Replacement sequence not found for: " + oldFootageName);  // Debug output
            }
        }
    }

    app.endUndoGroup();

    alert("Footage replacement complete.");
})();
