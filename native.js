import {installAndroidUI} from './android-ui.js';
import {Capacitor} from '@capacitor/core';
import {Filesystem,Directory,Encoding} from '@capacitor/filesystem';
import {Share} from '@capacitor/share';
import {App} from '@capacitor/app';
if(Capacitor.isNativePlatform()){
  if(Capacitor.getPlatform()==='android')installAndroidUI();
  window.download=async function(text,name){
    const file=await Filesystem.writeFile({path:name,data:text,directory:Directory.Cache,encoding:Encoding.UTF8});
    await Share.share({title:name,files:[file.uri],dialogTitle:'Uložit nebo sdílet'});
  };
  window.openSettings=function(){
    showDialog('Nastavení',`<p class="help">Záznamy jsou uložené v této aplikaci na tomto telefonu. Nesynchronizují se s webem ani jiným telefonem. Nemají vlastní šifrování ani PIN. Odinstalováním aplikace můžete o data přijít.</p><div class="toolbar"><button type="button" onclick="backup()">Uložit zálohu</button><button type="button" onclick="document.getElementById('restore').click()">Obnovit zálohu</button></div><input hidden type="file" id="restore" accept="application/json,.json" onchange="restoreBackup(this.files[0])"><p class="help">Z webového diáře nejprve stáhněte zálohu a zde ji obnovte. Obnova nahradí současné záznamy.</p><div class="helpbox"><b>Připomínky</b><br>Šipkou u události připravíte soubor pro kalendář telefonu. Jeho přidání je nutné potvrdit v podporované kalendářové aplikaci. Diář sám zatím neposílá oznámení při zavření.</div><p class="help">Počasí: Open-Meteo. Vyžaduje internet; záznamy lze používat offline. <button type="button" onclick="modal.close();openWeather()">Změnit město</button></p><p class="help">Jmeniny: namedays-cs · MIT licence</p><p class="help">Mobilní verze 1.0 · ${Capacitor.getPlatform()==='ios'?'iPhone':'Android'}</p>`,()=>modal.close());
  };
  App.addListener('backButton',()=>{
    if(modal.open){modal.close();return;}
    if(location.hash&&location.hash!=='#dnes'){location.hash='dnes';return;}
    App.minimizeApp();
  });
  App.addListener('appStateChange',({isActive})=>{if(isActive){updateClock();render();loadWeather();}});
}
