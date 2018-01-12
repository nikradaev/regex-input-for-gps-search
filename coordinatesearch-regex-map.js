                // implemented handling different patterns for coordinates search
                
                me.key = "coordinate";

                me.search = function (textSearchString, extent) {
                    //  Here we are testing for a lat lng pattern match.  This will need to be changed or extended in the future.
                    var matches = textSearchString.match(/^(\-?\d+(\.\d+)?)[,/: ]\s*(\-?\d+(\.\d+)?)$/);
                    if (matches == null) {

                    // removing (chopping off) the whitespaces or other characters from end of line until hit the first digit, so we can have the second argument on the right place / match[7] / 
                    for (i = textSearchString.length - 1; i > 0; i--) {
                        if (textSearchString[i].match(/^\d$/)) break;
                        if (textSearchString[i].match(/^[\s\;\,\°]+$/)) textSearchString = textSearchString.slice(0, i) + textSearchString.slice(i + 1, textSearchString.length);
                    }

                    // Regular expression pattern as following:
                    // -+digit(with .) whitespace-+ -+digit(with .)(') -+digit(with .)(") A-Za-z [whitespace / delimeter] -+digit(with .) whitespace-+ -+digit(with .)(') -+digit(with .)(") A-Za-z whitespace
                    var decExpr = /^(\-?\+?\d*(?:\.\d*)?(?:\s*))(\-?\+?\d*(?:\.\d*)?)(\'*)(?:\s*)(\-?\+?\d*(?:\.\d*)?)(\"*)(?:\s*)([A-Za-z]*)[\,\:\;\s\ ]+(\-?\+?\d*(?:\.\d*)?(?:\s*))(\-?\+?\d*(?:\.\d*)?)(\'*)(?:\s*)(\-?\+?\d*(?:\.\d*)?)(\"*)(?:\s*)([A-Za-z]*)$/;

                    // match the regex
                    var match = textSearchString.match(decExpr);
                   
                    // if null - pass null
                    if (match == null) {
                        self.appViewModel.resultsViewModel.coordinateSearchResult(null);
                        return;
                    }

                    var point = textSearchString.match(/-?\d+(\.\d+)?/g);
                    // handling the signs (+-) 
                    var latSign = Math.sign(match[1] * 1);
                    if (latSign == 0 || latSign == -0) latSign = 1;

                    var lngSign = Math.sign(match[7] * 1);
                    if (lngSign == 0 || lngSign == -0) lngSign = 1;

                    var latSignAdj = 1;
                    var lngSignAdj = 1;

                    // coefficients for minutes and seconds
                    var latMinMul = 1 / 60;
                    var lngMinMul = 1 / 60;

                    var latSecMul = 1 / 3600;
                    var lngSecMul = 1 / 3600;

                    // reverting signs if hit 's' or 'w'
                    if (match[6].charAt(0).toLowerCase() == 's') {
                        latSign = latSign * -1;
                        latSignAdj = -1;
                    }

                    if (match[12].charAt(0).toLowerCase() == 'w') {
                        lngSign = lngSign * -1;
                        lngSignAdj = -1;
                    }

                    // creating an array with proper decimal coordinates and correct signs (-+)
                    var point = [latSignAdj * match[1] + latSign * (latMinMul * match[2] + latSecMul * match[4]),
                        lngSignAdj * match[7] + lngSign * (lngMinMul * match[8] + lngSecMul * match[10])];

                    var latLng = self.appViewModel.mapViewModel.createLatLong(point[0], point[1]);
                    self.appViewModel.resultsViewModel.coordinateSearchResult(latLng);
