const express = require('express');
const app = express();
const session = require('express-session');
const redis = require('redis');
const redisStore = require('connect-redis')(session);
const https = require('https');
const nodemailer = require('nodemailer');
const path = require('path');
const mysql = require('mysql');
const fs = require("fs");
const http = express();
const bodyParser = require('body-parser');
const portHTTP = process.env.PORT || "80";
const portHTTPS = process.env.PORT || "443";
const options = {key: fs.readFileSync("/etc/letsencrypt/live/farnesecaffe.it-0001/privkey.pem"), cert:fs.readFileSync("/etc/letsencrypt/live/farnesecaffe.it-0001/fullchain.pem")};
const dbconn = mysql.createConnection({host : 'localhost', user : 'root', password : 'Matisse2022', database : 'farnesecaffe'});
const dbconnST = mysql.createConnection({host : 'localhost', user : 'root', password : 'Matisse2022', database : 'simonetovagliari'});
const mailconn = nodemailer.createTransport({host: "smtps.aruba.it", auth: {user: 'no-reply@farnesecaffe.it', pass: 'Farnese.2020'}, port: 465});
const domains = ["farnesecaffe.it","simonetovagliari.farnesecaffe.it"];
const redisclient = redis.createClient();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({secret: 'BerTiv2022', store: new redisStore({ host: 'localhost', port: 6379, client: redisclient, ttl: 260}), saveUninitialized: true, resave: false}));
//app.use(express.static(path.join(__dirname, 'public'))); //index e sitemap vanno dentro public
app.use("/st", express.static(path.join(__dirname, 'simonetovagliari')));
app.use("/video", express.static(path.join(__dirname, 'video')));
app.use("/js", express.static(path.join(__dirname, 'js')));
app.use("/img", express.static(path.join(__dirname, 'immagini')));
app.use("/css", express.static(path.join(__dirname, 'css')));
app.use("/descr", express.static(path.join(__dirname, 'descrizioni')));
app.use("/flags", express.static(path.join(__dirname, 'flags')));



const server = https.createServer(options, app);
dbconn.connect();
dbconnST.connect();

//---------------------------------------------------------------------------------------------------------------

function checkLangSession(r)
{
	if(r.session.lang){ return r;}
	r.session.lang="it-it";
	return r;
}

//---------------------------------------------------------------------------------------------------------------
//res.sendFile(indexFile, { root: __dirname + '/public' });
//console.log(req.url);

app.use('/', function(req, res, next)
{
	if (req.url == "/") res.redirect('https://' + req.headers.host + "/home");
	next();
});

app.use("/", express.static(path.join(__dirname, 'public')));

//app.get('/', function(req,res)
//{
	//res.sendFile(__dirname + "/public/index.html");
	//res.redirect('https://' + req.headers.host + "/home");
//});

app.get('/:det', function(req,res)
{
	//console.log(req.url);
	var det = req.params.det;
	var host = req.headers.host;
	if (host == domains[0])
    {
		if (det == "prodotti") res.sendFile(__dirname + "/public/prodotti.html");
		else if (det == "contatti") res.sendFile(__dirname + "/public/contatti.html");
		else if (det == "manageServer") res.sendFile(__dirname + "/public/manageServer.html");
		else if (det == "home") res.sendFile(__dirname + "/public/index.html");
		else if (det == "corsi") res.sendFile(__dirname + "/public/corsi.html");
		else if (det == "sitemap") res.sendFile(__dirname + "/sitemap.html");
		else res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}
	else
	{
		if (det == "home") res.sendFile(__dirname + "/simonetovagliari/index.html");
		else if (det == "contatti") res.sendFile(__dirname + "/simonetovagliari/contatti.html");
		else if (det == "prodotti") res.sendFile(__dirname + "/simonetovagliari/prodotti.html");
		else if (det == "dettagli") res.sendFile(__dirname + "/simonetovagliari/details_canteen.html");
		else if (det == "sitemap") res.sendFile(__dirname + "/sitemap.html");
		else res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}
});

app.get('/prodotti/:det', function(req,res)
{
    var det = req.params.det;
	var host = req.headers.host;
	if (host == domains[0])
    {
		if (det == "bar") res.sendFile(__dirname + "/public/prodotti_bar_miscele.html");
		else if (det == "casa") res.sendFile(__dirname + "/public/prodotti_casa.html");
		else res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}
	else
	{
		res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}	
});

app.get('/prodotti/casa/:det', function(req,res)
{
    var det = req.params.det;
	var host = req.headers.host;
	if (host == domains[0])
    {
		if (det == "macchine") res.sendFile(__dirname + "/public/prodotti_bar_macchine.html");
		else if (det == "capsulecialde") res.sendFile(__dirname + "/public/prodotti_ocs_capsule.html");
		else res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}
	else
	{
		res.status(404).send("Opss! Pagina errata o accesso non consentito.");
	}
});

app.post('/cookieRequest', function(req,res)
{
	var data = req.body;
	var sql = "insert into preferencesCookie(publicIP, detail) values(?,?)";
	dbconn.query(sql,[data.ipaddr,data.pref]);
	res.send("ok");
});

app.post('/session', function(req,res)
{
	if(req.session.lang == undefined)
	{ 
		req.session.lang = "it-it";
	}
	
	// req=checkLangSession(req);
    var cod = req.body.code;
	if (cod == 1)
	{
		res.send(req.session.lang);
	}
	if (cod == 2)
	{
		req.session.lang = req.body.lang;
		res.send("ok");
	}
});

app.post('/formRequest', function(req,res)
{
	req=checkLangSession(req);
    var data = req.body;

    var htmlInfo = "<html><h2>Hai una nuova richiesta di informazioni!</h2><h4>Di seguito i dettagli</h4><p>Nome e cognome: "+data.name+"</p><p>Societ&agrave;: "+data.soc+"</p><p>Numero di telefono: "+data.number+"</p><p>Email: "+data.emailAddress+"</p><p>Messaggio: "+data.message+"</p><button><a href='mailto:"+data.emailAddress+"'>Rispondi al cliente</a></button></html>";
    var mailOptions = {from: '"farnesecaffe.it" <no-reply@farnesecaffe.it>',to: 'info@farnesecaffe.it',subject: 'Richiesta informazioni', html: htmlInfo};
    mailconn.sendMail(mailOptions, function(error, info){if (error) {console.log(error);} else {console.log('Email sent');}});
    
    var htmlYour = "<html><h2>La tua richiesta</h2><h4>Di seguito il messaggio della richiesta che hai inviato a farnesecaffe.it</h4><p>"+data.message+"</p></html>";
    mailOptions = {from: '"farnesecaffe.it" <no-reply@farnesecaffe.it>',to: data.emailAddress,subject: 'La tua richiesta', html: htmlYour};
    mailconn.sendMail(mailOptions, function(error, info){if (error) {console.log(error);} else {console.log('Email sent');}});
    //res.end(data);
});

app.post('/requests', function(req,res)
{
	if (req.body.val == "barmiscele")
	{
		var query = "select m.nome as nome, m.descr as descr, m.pathDescr as pdescr from miscela m, listino l where l.idmiscelaFk=m.id and l.idformatoFk=(select distinct id from formato where descr like 'sacco 1kg') and m.descr not like '' order by m.id";
		dbconn.query(query, function (err, rows, fields)
		{
			if (rows.length>0)
			{
				var sxdx=["sx","dx"];
				var rightleft=["right","left"];
				var colors=["#4F2B1Ccc","#000000cc"];
				var html="";
				
				for (var i=0; i<rows.length; i++)
				{
					var curidx=i%2;
					var imgfold=rows[i].nome.split(" ")[0];
					var nameUp=rows[i].nome.toUpperCase();
					var divImg="<div class='col d-flex justify-content-center' style='height: auto; margin-bottom: 1%; margin-top: 1%;'><img class='img_prodotti_miscele' src='../../img/miscele/"+imgfold+"/1.png' /></div>";
					tmpHtml="<div class='row slide_animated_prodotti_bar_"+sxdx[curidx]+"' style='margin-bottom: 3%; margin-top: 3%;background-color:"+colors[curidx]+";'>**<div class='col col_prodotti d-flex justify-content-center' style='height: auto; margin-right: 0;'><div class='row container_description_"+rightleft[curidx]+"'><p class='text_title_machine'>"+nameUp+"</p><p class='text_description_machine lang'>??<br><b class='lang' key='SMBUSTA'></b></br></p></div></div>^^</div>";

					if(curidx==0)
					{
						tmpHtml=tmpHtml.replace("**",divImg);
						tmpHtml=tmpHtml.replace("^^","");
					}
					else
					{
						tmpHtml=tmpHtml.replace("**","");
						tmpHtml=tmpHtml.replace("^^",divImg);
					}
					
					var pfile = "";
					if (req.session.lang=="it-it")
					{
						pfile = __dirname+"/descrizioni/"+rows[i].pdescr+"_it.txt";
					}
					else
					{
						pfile = __dirname+"/descrizioni/"+rows[i].pdescr+"_en.txt";
					}
					
					var txt = fs.readFileSync(pfile, 'utf8');
					tmpHtml=tmpHtml.replaceAll("??",txt);
					html+=tmpHtml;
				}
				res.send(html);
			}
		});
	}

	
	if (req.body.val == "casacc")
    {
		var query = "";
		if (req.session.lang=="en-gb"){query = "select m.nome as misc, group_concat(f.nameImg) as form, group_concat(f.titleEn) as tit from listino l, miscela m, formato f where l.idusoFk=1 and l.idmiscelaFk=m.id and l.idformatoFk=f.id group by misc order by misc DESC;";}
		else {query = "select m.nome as misc, group_concat(f.nameImg) as form, group_concat(f.titleIt) as tit from listino l, miscela m, formato f where l.idusoFk=1 and l.idmiscelaFk=m.id and l.idformatoFk=f.id group by misc order by misc DESC;";}		

		dbconn.query(query, function (err, rows, fields)
		{
			if (rows.length>0)
			{
				var sxdx=["sx","dx"];
				var rightleft=["right","left"];
				var colors=["#4F2B1Ccc","#000000cc"];
				var html="";
				var compatibility="<div class='col tipo_formato'><img class='btn img_capsula' src='../../img/formati/!!.png' /><p class='text_description_capsula'>??<i style='color: green;' class='bi bi-check2-circle'></i><br></p></div>";
				
				for (var i=0; i<rows.length; i++)
				{
					var curidx=i%2;
					var curmisc=rows[i].misc;
					var titles=rows[i].tit.split(",");
					var picnames=rows[i].form.split(",");
					var main="<div class='row slide_animated_prodotti_bar_"+sxdx[curidx]+"' style='margin-bottom: 3%; margin-top:3%; background-color:"+colors[curidx]+";'>**<div class='col col_cap d-flex justify-content-center' style='height:auto; margin-right:0;'><div class='row container_description_"+rightleft[curidx]+"'><p class='text_title_machine'>"+curmisc.toUpperCase()+"</p><div class='container d-flex justify-content-center mb-3 mt-3'><div class='row d-flex justify-content-center'><img class=' img_mobile img_prodotti_capsula_1 mb-3' src='../../img/prodotti/capsule_cialde/"+curmisc.split(" ")[0]+"/1.png' />!!</div></div></div></div>^^</div>";
					var divImg="<div class='col d-flex justify-content-center' style='height: 60vh; margin-bottom: 1%; margin-top: 1%;'><img class='img_browser img_prodotti_capsula_1' src='../../img/prodotti/capsule_cialde/"+curmisc.split(" ")[0]+"/1.png' /></div>";
					
					var tmp="";
					for (var j=0; j<titles.length; j++)
					{
						tmp+=compatibility;
						tmp=tmp.replace("!!",picnames[j]);
						tmp=tmp.replace("??",titles[j]);
					}
					main=main.replace("!!",tmp);
					
					if(curidx==0)
					{
						main=main.replace("**",divImg);
						main=main.replace("^^","");
					}
					else
					{
						main=main.replace("**","");
						main=main.replace("^^",divImg);
					}

					html+=main;
				}
			}
			res.send(html);
		});
    }


	if (req.body.val == "macchine")
	{
		var query = "select f.glbtype as tipo, group_concat(m.modello) as modello from formato f, macchina m where f.id=m.idformatoFk and (f.glbtype like 'cialda' or f.glbtype like 'capsula') group by tipo order by tipo;";
		
		dbconn.query(query, function (err, rows, fields)
		{
			if (rows.length>0)
			{
				var sxdx=["sx","dx"];
				var rightleft=["right","left"];
				var colors=["#4F2B1Ccc","#000000cc"];
				var numLR=["1","2"];
				var addStyle=["","style='transform: scaleX(1);'"];
				var htmlFrameCapsule="";
				var htmlFrameCialde="";
				var macchineCapsule=rows[0].modello.split(",");
				var macchineCialde=rows[1].modello.split(",");
				var globalImgDiv="<div class='col d-flex justify-content-center' style='margin-bottom: 5%; margin-top: 5%;'><img class='img_prodotti_bar_??' !! src='../../img/macchine/^^/1.png' /></div>";
				
				for (var i=0; i<macchineCapsule.length; i++)
				{
					var curidx=i%2;
					var curmac=macchineCapsule[i];
					var curfolder=curmac.replaceAll(" ","_");
					var curImgDiv=globalImgDiv.replace("??",numLR[curidx]).replace("!!",addStyle[curidx]).replace("^^",curfolder);
					
					htmlFrameCapsule+="<div class='row slide_animated_prodotti_bar_"+sxdx[curidx]+"' style=' margin-bottom: 5%; margin-top:5%; background-color:"+colors[curidx]+";'>!!<div class='col d-flex justify-content-center' style='margin-bottom: 1%; margin-top: 1%; margin-right: 0;'><div class=' container_description_"+rightleft[curidx]+"'><div class='row-2'><p class='text_title_machine'>"+curmac.toUpperCase()+"</p></div><div class='row'><div class='col d-flex justify-content-center' style='height: auto; margin-right: 0;'><div class='row container_description_type_format'><div class='col tipo_formato'><img class='btn img_capsula' src='../../img/formati/fap.png' /><p class='text_description_capsula lang' key='"+rows[0].tipo.toUpperCase().replaceAll(' ', '_')+"'><i style='color: green;' class='bi bi-check2-circle'></i><br></p></div></div></div></div><div class='mb-3 row d-flex justify-content-center'><a id='btn_details' class='btn btn-dark button_details_machine button-text-0 d-flex justify-content-center lang' href='../../details_machine.html?filemac="+curfolder+"' key='GO_DET'></a></div></div></div>^^</div>";
					
					if (curidx==0)
					{
						htmlFrameCapsule=htmlFrameCapsule.replace("!!",curImgDiv);
						htmlFrameCapsule=htmlFrameCapsule.replace("^^","");
					}
					else
					{
						htmlFrameCapsule=htmlFrameCapsule.replace("!!","");
						htmlFrameCapsule=htmlFrameCapsule.replace("^^",curImgDiv);
					}
				}
				
				for (var i=0; i<macchineCialde.length; i++)
				{
					var curidx=i%2;
					var curmac=macchineCialde[i];
					var curfolder=curmac.replaceAll(" ","_");
					var curImgDiv=globalImgDiv.replace("??",numLR[curidx]).replace("!!",addStyle[curidx]).replace("^^",curfolder);
					
					htmlFrameCialde+="<div class='row slide_animated_prodotti_bar_"+sxdx[curidx]+"' style=' margin-bottom: 5%; margin-top:5%; background-color:"+colors[curidx]+";'>!!<div class='col d-flex justify-content-center' style='margin-bottom: 1%; margin-top: 1%; margin-right: 0;'><div class=' container_description_"+rightleft[curidx]+"'><div class='row-2'><p class='text_title_machine'>"+curmac.toUpperCase()+"</p></div><div class='row'><div class='col d-flex justify-content-center' style='height: auto; margin-right: 0;'><div class='row container_description_type_format'><div class='col tipo_formato'><img class='btn img_capsula' src='../../img/formati/cialda.png' /><p class='text_description_capsula lang' key='"+rows[1].tipo.toUpperCase().replaceAll(' ', '_')+"'><i style='color: green;' class='bi bi-check2-circle'></i><br></p></div></div></div></div><div class='mb-3 row d-flex justify-content-center'><a id='btn_details' class='btn btn-dark button_details_machine button-text-0 d-flex justify-content-center lang' href='../../details_machine.html?filemac="+curfolder+"' key='GO_DET'></a></div></div></div>^^</div>";
					
					if (curidx==0)
					{
						htmlFrameCialde=htmlFrameCialde.replace("!!",curImgDiv);
						htmlFrameCialde=htmlFrameCialde.replace("^^","");
					}
					else
					{
						htmlFrameCialde=htmlFrameCialde.replace("!!","");
						htmlFrameCialde=htmlFrameCialde.replace("^^",curImgDiv);
					}
				}
			}
			res.send([htmlFrameCapsule,htmlFrameCialde]);
		});
	}


	if (req.body.val == "detmacchina")
	{
		var imgMac=req.body.fileMac;
		var nameMac=imgMac.replaceAll("_"," ").toUpperCase();
		var htmlDet="<div class='row frame_macchine'><div class='col container'><div class='row d-flex justify-content-center'><p class='text_bar slide_animated_prodotti_text'>"+nameMac+"</p></div></div></div><div class='container frame_details_mobile'><img class=' img_details_machine_mobile slide_animated_prodotti_img' src='../../img/macchine/??/1.png' /><div class='text_detail slide_animated_prodotti_img'><br class='lang' key='DET'><br></div><p class=' text_description_machine slide_animated_prodotti_img'>!!</p></div><div class='container frame_details' id='slide_animated_background' ><div class='row' style='width: 100%;'><div class='col col_details d-flex justify-content-center'><img class=' img_details_machine slide_animated_prodotti_img' src='../../img/macchine/??/1.png' /></div><div class='col'><div class='text_detail slide_animated_prodotti_img'><br>DETTAGLIO:<br></div><p class=' text_description_machine slide_animated_prodotti_img'>!!</p></div></div></div>";	
		
		htmlDet=htmlDet.replaceAll("??",imgMac);
		var pfile = "";
		if (req.session.lang=="it-it")
		{
			pfile = __dirname+"/descrizioni/"+imgMac+"_it.txt";
		}
		else
		{
			pfile = __dirname+"/descrizioni/"+imgMac+"_en.txt";
		}
		
		fs.readFile(pfile, 'utf8', function(err, data)
		{ 
			if (err) throw err; 
			htmlDet=htmlDet.replaceAll("!!",data);
			res.send(htmlDet);
		});
	}
	
	if (req.body.val == "stcanteen")
	{
		var query = "select * from cantina;";
		dbconnST.query(query, function (err, rows, fields)
		{
			if (rows.length>0)
			{
				var html = "<div class='row d-flex slide_animated_prodotti_text justify-content-center container-wave'><svg xmlns='wave5.svg' viewBox='0 0 1440 320'><path fill='??' fill-opacity='1' d='M0,192L60,160C120,128,240,64,360,80C480,96,600,192,720,240C840,288,960,288,1080,272C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'></path></svg><div class='container box-canteen' style='background-color: ??;'><div class='col-6'><h1 class='text-title-single-canteen'>!!</h1><p class='text-description-canteen'>^^</p></div><div class='col-4 box-details-canteen'><a class='btn button-details-canteen' type='button' href='../st/details_canteen.html?canteen=!!'><i class='bi bi-arrow-right-circle'style='scale: 3;'></i></a></div></div><svg xmlns='wave6.svg' viewBox='0 0 1440 320'><path fill='??' fill-opacity='1' d='M0,128L40,144C80,160,160,192,240,197.3C320,203,400,181,480,165.3C560,149,640,139,720,165.3C800,192,880,256,960,240C1040,224,1120,128,1200,74.7C1280,21,1360,11,1400,5.3L1440,0L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z'></path></svg></div>";				
				var toSend = '';
				
				for (var i=0; i<rows.length; i++)
				{
					var descr = '';
					if (req.session.lang == 'it-it') {descr = rows[i].descrIT;}
					else {descr = rows[i].descrENG;}
					
					toSend = toSend+html;
					toSend = toSend.replaceAll("!!", rows[i].nome);
					toSend = toSend.replaceAll("??", rows[i].colore);
					toSend = toSend.replaceAll("^^", descr);
				}
				res.send(toSend);
			}
		});
	}
	
	if (req.body.val == "bottles")
	{
		var query = "select * from cantina c, vino v where c.id=v.fkCantina and c.nome like ?";
		
		dbconnST.query(query, [req.body.nameC], function (err, rows, fields)
		{
			var htmlToSend = "";
			if (rows.length>0)
			{
				// var singleDiv = "<svg xmlns='wave5.svg' viewBox='0 0 1440 320'><path fill='#855c5ccc' fill-opacity='1' d='M0,192L60,160C120,128,240,64,360,80C480,96,600,192,720,240C840,288,960,288,1080,272C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'></path> </svg><div class='container box-canteen' style='background-color: #855c5ccc;'><div class='col-8'><h1 class='text-title-single-wine mb-2'> <b>??</b> </h1><div class='container box-wine'><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='DESCWINE'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='NOTEDEG'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='ASSEMBLAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='TIRAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='DOSAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='MATURAZIONE'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='ACCENO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='VINIF'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div><div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='TEMP'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div></div></div><div class='col-4 img-bottle '><img class='scaled-image' src='../img/one_love/bottle/bt1.png' alt='BottigliaWine'></div></div><svg xmlns='wave6.svg' viewBox='0 0 1440 320'><path fill='#855c5ccc' fill-opacity='1'd='M0,128L40,144C80,160,160,192,240,197.3C320,203,400,181,480,165.3C560,149,640,139,720,165.3C800,192,880,256,960,240C1040,224,1120,128,1200,74.7C1280,21,1360,11,1400,5.3L1440,0L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z'></path></svg>";

				var singleDiv = "<svg xmlns='wave5.svg' viewBox='0 0 1440 320'><path fill='#855c5ccc' fill-opacity='1' d='M0,192L60,160C120,128,240,64,360,80C480,96,600,192,720,240C840,288,960,288,1080,272C1200,256,1320,224,1380,208L1440,192L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z'></path> </svg><div class='container box-canteen' style='background-color: #855c5ccc;'><div class='col'><h1 class='text-title-single-wine mb-2'> <b>??</b> </h1><div class='container box-wine'>";


				for (var i=0; i<rows.length; i++)
				{
					htmlToSend = htmlToSend + singleDiv;
					var nome = rows[i].nome;
					var descr = '';
					var degust = '';
					var assemb = '';
					var tiraggio = rows[i].tiraggio;
					var dosaggio = rows[i].dosaggio;
					var maturaz = '';
					var acceno = '';
					var vinificaz = '';
					var tempS = rows[i].tempservizio;

					if (req.session.lang=="it-it")
					{
						descr = rows[i].descrIT;
						degust = rows[i].degustIT;
						assemb = rows[i].assembIT;
						maturaz = rows[i].maturazIT;
						acceno = rows[i].accenoIT;
						vinificaz = rows[i].vinificazIT;
					}
					else
					{
						descr = rows[i].descrENG;
						degust = rows[i].degustENG;
						assemb = rows[i].assembENG;
						maturaz = rows[i].maturazENG;
						acceno = rows[i].accenoENG;
						vinificaz = rows[i].vinificazENG;
					}

					htmlToSend = htmlToSend.replaceAll("??", nome);
					if(descr!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='DESCWINE'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", descr);
					}
					if(degust!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='NOTEDEG'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", degust);
					}
					if(assemb!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='ASSEMBLAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", assemb);
					}
					if(tiraggio != " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='TIRAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", tiraggio);
					}
					if(dosaggio!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='DOSAGGIO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", dosaggio);
					}
					if(maturaz!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='MATURAZIONE'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", maturaz);
					}
					if(acceno!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='ACCENO'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", acceno);
					}
					if(vinificaz!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='VINIF'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", vinificaz);
					}
					if(tempS!= " "){
						htmlToSend = htmlToSend + "<div class='row mb-3'><div class='col-4'><p class='text-title-description-wine lang' key='TEMP'></p></div><div class='col text-sub-description-wine'>!!<div class='custom-line'></div></div></div></div></div>"
						htmlToSend = htmlToSend.replace("!!", tempS);
					}
					htmlToSend = htmlToSend + "<div class='col-4 img-bottle '><img class='scaled-image' src='../img/one_love/bottle/"+nome+".png' alt='BottigliaWine'></div></div><svg xmlns='wave6.svg' viewBox='0 0 1440 320'><path fill='#855c5ccc' fill-opacity='1'd='M0,128L40,144C80,160,160,192,240,197.3C320,203,400,181,480,165.3C560,149,640,139,720,165.3C800,192,880,256,960,240C1040,224,1120,128,1200,74.7C1280,21,1360,11,1400,5.3L1440,0L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z'></path></svg>";
			
				}

				}
			res.send(htmlToSend);
		});
	}


});

//---------------------------------------------------------------------------------------------------------------

http.get('*',function(req, res)
{ 
    res.redirect('https://' + req.headers.host + req.url);
});

http.listen(portHTTP);
server.listen(portHTTPS);