#Jak uruchomić Movie lists

1. Uruchom Chrome tą komendą

        "[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
        
2. Uruchom na localhostcie projekt CMS-front, w chromie wspomnianym wyżej, folder site. W visual code opcja "Go live". (U mnie adres http://127.0.0.1:5001/site/)

3. Odpal backend w folderze CMS/api komendą  (Ja używam Pycharm). Na innych portach nie bedzie działać

        python3 -m flask run -h localhost -p 3000
        
4. Strona powinna działać
