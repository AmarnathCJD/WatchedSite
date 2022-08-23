import requests

cookies = {
    '_ga': 'GA1.2.986537517.1661075032',
}

headers = {
    'authority': 'rabbitstream.net',
    'accept': '*/*',
    'accept-language': 'en-GB,en-US;q=0.9,en;q=0.8',
    # 'cookie': '_ga=GA1.2.986537517.1661075032',
    'referer': 'https://www.2embed.to/',
    'sec-ch-ua': '".Not/A)Brand";v="99", "Google Chrome";v="103", "Chromium";v="103"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Linux"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-origin',
    'user-agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36',
    'x-requested-with': 'XMLHttpRequest',
}

params = {
    'id': 'c7bvcL6DFxIJ',
    '_number': '1',
    'sId': 'tMK9W5pbb5PYDSCEuuMt',
}

response = requests.get('https://rabbitstream.net/ajax/embed-5/getSources', params=params, cookies=cookies, headers=headers)
print(response.text)