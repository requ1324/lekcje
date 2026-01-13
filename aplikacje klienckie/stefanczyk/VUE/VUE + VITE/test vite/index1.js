import {value, obj} from './modules/data1.js';
console.log("export value i obj z pliku data1.js", { value, obj })
import { number, allFunctions } from "./modules/data3"

allFunctions.add(10)
allFunctions.remove(40)

console.log("number = ", number)
console.log("po dodaniu 10, number =", number)
