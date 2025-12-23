/*
replaceFootageCompositionDiffName.js
- Script for replace multiple footage from project panel to composition panel 
  that have different name. Suitable for AOV's render workflow.
- https://github.com/muhammadli3d
- 2025-12-23

--------------------------------------------------------------------------------
1. Select footage in Project Panel
2. Select layers in Composition Panel to replace
3. Run script in After Effects
4. Enter text to find and replace on pop window
--------------------------------------------------------------------------------
*/


(function replaceFootageComposition() {
	// Ensure there is an active project
	var project = app.project;

	// Get selected new footage items from the project panel
	var selectedNewFootage = project.selection;
	if (selectedNewFootage.length === 0) {
		alert("No new footage selected in the Project Panel.");
		return;
	}
	
	// Pop up an error if there is no selection in composition panel
	var compPanel = app.project.activeItem
	if (compPanel.selectedLayers.length === 0) {
		alert("No layers selected in the Composition Panel.");
		return;
	}
	
	// Prompt the user to enter text to find
	var textToFind = prompt("Enter the text to find in Composition Panel (e.g: 'char_A'):", "");
	if (!textToFind) {
		alert("Text to find is required.");
		return;
	}
	
	// Then prompt the user to enter text to replace
	var textToReplace = prompt("Enter the text to replace in Project Panel (e.g: 'char_B'):", "")
	if (!textToFind) {
		alert("Text to replace with is required.")
		return;
	}
	
	// Create a map of new footage names (with text to replace) to their sources
	var newFootageSources = {};
	for (var i = 0; i < selectedNewFootage.length; i++) {
		var newFootage = selectedNewFootage[i];
		if (newFootage instanceof FootageItem) {
			var newFootageName = newFootage.name;
			if (newFootageName.indexOf(textToReplace) !== -1) {
				var strippedNewName = newFootageName.replace(textToReplace, '');
				newFootageSources[strippedNewName] = newFootage;
			}
		}
	}
	
	// Get selected layers from all compositions
	var comp, selectedLayers;
	for (var compIndex = 1; compIndex <= project.items.length; compIndex++) {
		comp = project.items[compIndex];
		if (comp instanceof CompItem) {
			selectedLayers = comp.selectedLayers;
			if (selectedLayers.length > 0) {
				// Begin undo group
				app.beginUndoGroup("Replace Footage");
				
				// Loop through the selected layers and replace footage based on names
				for (var j = 0; j < selectedLayers.length; j++) {
					var oldLayer = selectedLayers[j];
					if (oldLayer instanceof AVLayer) {
						var oldLayerName = oldLayer.name;
						if (oldLayerName.indexOf(textToFind) !== -1) {
							var strippedOldName = oldLayerName.replace(textToFind, '');
							if (newFootageSources[strippedOldName]) {
								var newFootage = newFootageSources[strippedOldName];
								oldLayer.replaceSource(newFootage, false);
							}	
						}
					}
				}
				
				// End undo group
				app.endUndoGroup();
			}
		}
	}
	
	alert("Footage replaced successfully!");
})();
