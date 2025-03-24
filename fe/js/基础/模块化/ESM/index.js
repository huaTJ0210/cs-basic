import { age, incrementAge, student, getInnerAge } from "./bar.js";


console.log(student.age);
incrementAge();
console.log(student.age); // 动态绑定，

student.age = 30;

getInnerAge();
