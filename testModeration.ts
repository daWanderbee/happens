import { moderateText } from "./lib/moderate";

console.log("Test 1:", moderateText("I hate my life"));
console.log("Test 2:", moderateText("Motherfucker, you are so stupid!"));
console.log("Test 3:", moderateText("Bhenchod"));
console.log("Test 4:", moderateText("I love programming"));
console.log("Test 5:", moderateText("This is a neutral statement."));
