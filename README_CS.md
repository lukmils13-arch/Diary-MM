# Diář MM – Android a iPhone

Připravený zdrojový projekt pro obě platformy. ZIP není instalační aplikace.
Mobilní rozhraní převzalo aktuální funkce webového diáře a má vlastní úpravy poměrů,
větší denní stránku, kompaktní boční přehled a ovládání pod jmeninami.

## Co je ověřeno

- Webové zdroje se úspěšně sestaví a zkopírují do obou nativních projektů.
- 13 testů původní aplikační logiky prošlo.
- Nativní kompilace a použití na skutečném telefonu zatím ověřeny nejsou.
- APK ani podepsaná iOS aplikace zatím nebyly sestaveny.

## Spuštění pro vývojáře

Vyžaduje Node.js 22 nebo novější. Z kořenového adresáře projektu:

    cd mobile
    npm ci
    npm run sync

Android: instalovat Android Studio a příslušné SDK podle `android/variables.gradle`.

    npm run android

V Android Studiu spustit testovací telefon, následně vytvořit APK. Pro dlouhodobé
aktualizace použít vlastní podpisový klíč; soukromý klíč neukládat do projektu.

iPhone: na Macu s aktuálním Xcode:

    npm run ios

Vybrat vlastní Apple vývojářský tým v Signing & Capabilities. Ověřit na zařízení,
pak vytvořit Archive. Pro distribuci přes TestFlight nebo App Store je nutné členství
v Apple Developer Program a nastavení aplikace v App Store Connect.
Bundle identifier `cz.milsimer.diarmm` je pracovní a před první distribucí je nutné
ověřit jeho dostupnost. Obchody vyžadují ještě listing a kontrolu aplikace.

## Data a zabezpečení

Záznamy se ukládají lokálně v úložišti aplikace. Z webového prohlížeče se nepřenesou
samy: na webu stáhnout zálohu, v aplikaci otevřít Nastavení → Obnovit zálohu.
Obnova nahradí stávající data. Mezi telefony není synchronizace.
Aplikace neobsahuje vlastní PIN ani dodatečné šifrování záznamů.
Soukromé přihlášení webové stránky se do lokální aplikace nepřenáší.
Zálohy obsahují čitelné osobní údaje. Odinstalováním lze o místní záznamy přijít.

Počasí používá Open-Meteo a potřebuje internet; město volí uživatel, poloha se nezjišťuje.
Ostatní funkce mají lokálně zabalené zdroje a nepotřebují načíst webovou stránku.
Vlastní odkazy otevírají externí weby.

## Připomínky

Zachován export souboru ICS s připomínkou a opakováním do podporované kalendářové
aplikace. Export nyní používá systémové sdílení souboru. Přidání události musí uživatel
potvrdit a podpora importu závisí na aplikaci kalendáře. Diář sám neposílá upozornění
na pozadí. Nativní sdílení, import záloh, klávesnici, bezpečné okraje a ovládání Zpět
je ještě nutné ověřit na fyzickém Androidu a iPhonu.

Technické zdroje:
https://capacitorjs.com/docs/getting-started/environment-setup
https://capacitorjs.com/docs/apis/filesystem
https://capacitorjs.com/docs/apis/share
https://developer.apple.com/testflight/

## Úprava Androidu – navigace a nejbližší termíny

Android má šest navigačních tlačítek ve svislé liště vlevo. Dlaždice Narozeniny
je nahrazena přehledem Nejbližší termíny. Úvodní stránka už neobsahuje původní
boční výpis nejbližších událostí, zůstává denní stránka a tlačítko Kalendář.
Přehled seskupuje výskyty na následujících 12 měsíců do sloupců podle kategorií
(výchozí), osob nebo měsíců. Uvnitř skupin řadí od nejbližšího data; opakované
události vypisuje po jednotlivých výskytech. Sloupce lze posouvat vodorovně.
Narozeniny a svátky lze dál přidávat tlačítky v přehledu. Poslední zvolený způsob
seskupení si aplikace pamatuje. U obecných termínů bez přiřazené osoby používá
skupinu Společné, u narozenin a svátků jméno z události.

Nová změna je aktivní jen pro Android; původní web a rozložení iOS se nemění.
Kontrola: 17 úspěšných testů logiky a sestavení webových zdrojů pro nativní projekty.
Vizuální kontrola na fyzickém telefonu a nativní kompilace zůstávají neověřené.
