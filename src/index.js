import './index.css'

// Step 1: 引入所需要的依赖 Import the neccessary packages needed
// Docxtemplater for document generation
import Docxtemplater from 'docxtemplater';
// Pizzip to create a zip file from our template
import PizZip from 'pizzip';
// saveAs function from file-saverto prompt the user to save the generated document
import { saveAs } from 'file-saver';
// Our template's path as template from src/simple.docx
import template from './simple.docx';

// Step 2: Define the resume data 定义简历内会被填入的内容
let resume = {
    name: {
        first: 'John',
        last: 'Doe'
    },
    personalSummary: "Hi i'm John, a software engineer passionate about building well...software",
    jobTitle: 'Software Engineer',
    contact: {
        address: "Lagos, Nigeria",
        phone: '08123456789',
        email: 'johndoe@gmail.com'
    },
    meta_details: {
        dateOfBirth: '24th June, 1995',
        stateOfOrigin: 'Enugu',
        lga: 'Oji-River',
        gender: 'Male',
        maritalStatus: 'Single',
        religion: 'Christian'
    },
    workExperience: [
        {
            nameOfOrg: 'Acme Inc.',
            position: 'Software Developer',
            from: 'July, 2022',
            to: 'Present'
        }
    ],
    education: [
        {
            name: 'Creation Academy',
            location: 'Earth',
            type: 'Primary',
            qualificationObtained: 'Elementary School Certificate',
            started: '18th Feb, 2017',
            finished: '6th July, 2022'
        }
    ],
    referees: [
        {
            name: "Big man",
            nameOfOrg: 'Big man Inc',
            position: 'Big man position',
            contact: 'bigman@verybig.com'
        }
    ]
}

// Step 3: Call the generating function when the trigger is clicked 按钮点击调用生成方法
let trigger = document.querySelector('button');
trigger.addEventListener('click', (e) => {
    e.preventDefault();

    return generateDocument(resume, template);
});



// Step 4: Define the generating function 定义生成方法generateDocument()
// generateDocument()方法调用两个参数，一个resume对象和templatePath即文档的路径
// 在此方法中，通过fetch()方法以affarBuffer的形式载入文档，然后通过Pizzip将文档打包成zip文件

// 此方法是异步进行的，所以需要使用async...await来定义此方法

async function generateDocument(resume, templatePath) {
    // load the document template into docxtemplater
    try {
        let response = await fetch(templatePath);
        let data = await response.arrayBuffer();

        let zip = PizZip(data);
    //  创建Decxtemplater实例对象和其zip文件，并将resume对象传入render()方法中
        let templateDoc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        })
    
        templateDoc.render(resume);
    // 最后生成了注入了resume对象的建立文件，引导用户使用saveAs方法保存文件    
        let generatedDoc = templateDoc.getZip().generate({
            type: "blob",
            mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            compression: "DEFLATE"
        })

        saveAs(generatedDoc, `${resume.name.first}'s resume.docx`);
    } catch (error) {
        console.log('Error: ' + error);
    }
}

// 此项目目前需要Node.js环境支持，可能需要转化成纯原生静态