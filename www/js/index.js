/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
}

function badWord(parola) {
    if (parola === "merda")
        return true;
}

function analizzaTesto(testo) {
    let parole = testo.toLowerCase().split(/[\s.!?:;,]+/);
    let score = 0; // 0 OK, 1 dubbio, 2 da bloccare
    for (let i = 0; i < parole.length; ++i) {
        if (badWord(parole[i])) {
            ++score;
        }
    }
    let umore = "";
    let parere = "";
    let suono = "";
    if (score === 0) {
        umore = "img/felice.png";
        parere = "Non ho rilevato toni negativi nel testo, tuttavia qualcosa potrebbe sfuggirmi... pensaci bene e conta fino a 10 prima di inviarlo!";
        suono = "snd/positive.mp3";
    } else {
        umore = "img/triste.png";
        parere = "Il testo potrebbe contenere parole che sarebbe meglio evitare. Conta fino a 10 e rifletti attentamente prima di inviarlo...";
        suono = "snd/negative.mp3";
    }
    return { umore: umore, parere: parere, score: score, suono: suono };
}

function initPageTutorial() {
    let navigator = document.querySelector('#myNavigator');
    let count = 1;
    let buttonTutor = document.getElementById("button-tutor");
    let imgTutor = document.getElementById("img-tutor");
    let textTutor = document.getElementById("text-tutor");
    function next() {
        ++count;
        if (count === 2) {
            textTutor.innerHTML = "2) Leggi il feedback e conta fino a 10 prima di inviare";
            imgTutor.src = "img/screen02.png";
        } else if (count === 3) {
            textTutor.innerHTML = "3) Premi il bottone per copiare il testo da inviare";
            imgTutor.src = "img/screen03.png";
        } else if (count === 4) {
            textTutor.innerHTML = "4) Apri la tua app preferita (WhatsApp, Telegram...) ed invia il messaggio";
            imgTutor.src = "img/screen04.png";
        } else {
            myNavigator.pushPage('pageInput.html', { animation: 'fade' });
        }
    }
    buttonTutor.onclick = next;
    imgTutor.onclick = next;
}

function initPageAbout() {
    let navigator = document.querySelector('#myNavigator');
    let buttonAboutOk = document.getElementById("button-about-ok");
    buttonAboutOk.onclick = function () {
        navigator.popPage();
    };
}

function initPageInput() {
    let navigator = document.querySelector('#myNavigator');
    let textarea = document.getElementById("dacontrollare");
    let buttonControlla = document.getElementById("button-controlla");
    let buttonAbout = document.getElementById("button-about");
    textarea.value = "";
    buttonAbout.onclick = function () {
        navigator.pushPage('pageAbout.html', { animation: 'slide' });
    };
    buttonControlla.onclick = function () {
        testo = textarea.value;
        if (testo.trim().length === 0) {
            textarea.classList.add("errore");
        } else {
            textarea.classList.remove("errore");
            navigator.pushPage('pageFeedback.html', { data: { title: 'Page 2' } });
        }
    };
}

function initPageFeedback() {
    let toast = document.getElementById("toast-copiato");
    toast.style.display = "none";
    let loader = document.getElementById("loader");
    let feedback = document.getElementById("feedback");
    loader.style.display = "block";
    feedback.style.display = "none";
    setTimeout(function () {
        let analisi = analizzaTesto(testo);
        let umore = document.getElementById("umore");
        let parere = document.getElementById("parere");
        let countdown = document.getElementById("countdown");
        let bottoneCopia = document.getElementById("button-copia");
        let bottoneIndietro = document.getElementById("button-indietro");
        let navigator = document.querySelector('#myNavigator');
        bottoneCopia.style.display = "none";
        bottoneIndietro.style.display = "none";
        countdown.style.display = "block";
        umore.src = analisi.umore;
        parere.innerHTML = analisi.parere;
        new Media(analisi.suono).play();
        let score = analisi.score;
        bottoneCopia.onclick = function () {
            cordova.plugins.clipboard.copy(testo);
            toast.style.display = "block";
            setTimeout(function () {
                toast.style.display = "none";
            }, 5000);
            clearInterval(interval);
        }
        bottoneIndietro.onclick = function () {
            loader.style.display = "block";
            feedback.style.display = "none";
            toast.style.display = "none";
            navigator.popPage();
        }
        loader.style.display = "none";
        feedback.style.display = "block";
        countdown.innerHTML = "1";
        let conta = 2;
        let interval = setInterval(function () {
            if (conta <= 10) {
                countdown.innerHTML = conta;
                conta = conta + 1;
            } else {
                bottoneCopia.style.display = "block";
                bottoneIndietro.style.display = "block";
                countdown.style.display = "none";
            }
        }, 1000);
    }, 2000);
}

document.addEventListener('show', function (event) {
    let page = event.target;
    if (page.id === "pageSplash") {
        setTimeout(function () {
            myNavigator.pushPage('pageTutorial.html', { animation: 'fade' });
        }, 2500);
    } else if (page.id === 'pageTutorial') {
        initPageTutorial();
    } else if (page.id === 'pageInput') {
        initPageInput();
    } else if (page.id === 'pageFeedback') {
        initPageFeedback();
    } else if (page.id === 'pageAbout') {
        initPageAbout();
    }
});