window.onload = () =>{
    "use strict";
    const csInterface = new CSInterface();
    themeManager.init();
    
    const http = require("http");
    const url = require("url");
    
    const AIURL = "http://localhost:8000/";
    const extensionRoot = csInterface.getSystemPath(SystemPath.EXTENSION) +`/jsx/`;
    csInterface.evalScript(`$.evalFile("${extensionRoot}json2.js")`);//json2読み込み
    
    const linkImages = document.getElementById("linkImages");
    const openLists = document.getElementById("openLists");
    const AiDocument = document.getElementById("AiDocument");
    const justOpenAi = document.getElementById("justOpenAi");
    const SavePDFonAI = document.getElementById("SavePDFonAI");
    
    const server = http.createServer((req,res)=>{
        const url_parts = url.parse(req.url);
        switch(url_parts.pathname){
            case "/":
                if(req.method == "GET"){
                    res.writeHead(200,{"Content-Type":"text/plain"});
                    res.write("Photoshop server is running");
                    res.end();
                }else if(req.method == "POST"){
                    let body = "";
                    req.on("data",chunk=>{
                        body += chunk;
                    });
                    req.on("end",received=>{
                        received = JSON.parse(body);
                        writeList(received);
                        res.end();
                    });
                }else{
                    alert("error");
                    res.end();
                }
                break;
            
            default:
                res.writeHead(200,{"Content-Tyoe":"text/plain"});
                res.end("no page .....");
                break;
        }
    });
    
    function writeList(list){
        console.log(list);
        removeList(linkImages);
        list[0].forEach(v=>{
            const li = document.createElement("li");
            li.textContent = v.name;
            li.dataset.name = v.name;
            li.dataset.path = v.path;
            li.dataset.fullName = v.fullName;
            linkImages.appendChild(li);
        });
        AiDocument.textContent = list[1];
    }
    
    function removeList(parent){
        while(parent.firstChild){
            parent.removeChild(parent.firstChild);
        }
    }
    
    server.listen(3000);
    
    openLists.addEventListener("click",()=>{
        const datasets = Array.from(document.querySelectorAll("#linkImages li"));
        const fullPaths = datasets.map(v => v.dataset.fullName);
        csInterface.evalScript(`openImages(${JSON.stringify(fullPaths)})`);
    });
    
    function isDocumentLoad(){
        if(AiDocument.textContent === ""||AiDocument.textContent === null||AiDocument.textContent=== undefined){
            alert("there's no Document path");
            return false;
        }else{
            return true;
        }
    }
    
    class EditOnAi{
        constructor(btn,url){
            this.btn = btn;
            this.url = url;
            this.btn.addEventListener("click",this);
        }
        
        async handleEvent(){
            if(!isDocumentLoad){
                return false;
            }
            const res = await fetch(this.url,{
                method:"POST",
                body:AiDocument.textContent,
                headers:{"Content-Type": "text/plain"}
            }).catch(err => alert(err));
                console.log(res);
        }
    }
    
    const justOpen = new EditOnAi(justOpenAi,AIURL);
    const savePDF = new EditOnAi(SavePDFonAI,`${AIURL}save`);
    /*
    justOpenAi.addEventListener("click",async ()=>{
        if(!isDocumentLoad){
            return false;
        }
        const res = await fetch(AIURL,{
            method:"POST",
            body:AiDocument.textContent,
            headers:{"Content-Type": "text/plain"}
        });
        console.log(res);
    });
    */
}
    
