from requests import get, post
from bs4 import BeautifulSoup


def get_vidcloud_stream(id, m3u8=False):
    try:
        media_server = (
            BeautifulSoup(
                get(
                    "https://www.2embed.to/embed/imdb/movie?id={}".format(id),
                    headers={"user-agent": "Mozilla/5.0"},
                ).text,
                "html.parser",
            )
            .find("div", class_="media-servers dropdown")
            .find("a")["data-id"]
        )
        recaptcha_resp = get(
            "https://recaptcha.harp.workers.dev/?anchor=https%3A%2F%2Fwww.google.com%2Frecaptcha%2Fapi2%2Fanchor%3Far%3D1%26k%3D6Lf2aYsgAAAAAFvU3-ybajmezOYy87U4fcEpWS4C%26co%3DaHR0cHM6Ly93d3cuMmVtYmVkLnRvOjQ0Mw..%26hl%3Den%26v%3DPRMRaAwB3KlylGQR57Dyk-pF%26size%3Dinvisible%26cb%3D7rsdercrealf&reload=https%3A%2F%2Fwww.google.com%2Frecaptcha%2Fapi2%2Freload%3Fk%3D6Lf2aYsgAAAAAFvU3-ybajmezOYy87U4fcEpWS4C"
        ).json()["rresp"]
        vidcloudresp = get(
            "https://www.2embed.to/ajax/embed/play",
            params={"id": media_server, "_token": recaptcha_resp},
        )
        vid_id = vidcloudresp.json()["link"].split("/")[-1]
        rbstream = "https://rabbitstream.net/embed/m-download/{}".format(
            vid_id)
        soup = BeautifulSoup(get(rbstream).text, "html.parser")
        return [
            a["href"] for a in soup.find("div", class_="download-list").find_all("a")
        ] if not m3u8 else vid_id
    except:
        return None


def get_m3u8_rabbitstream(id):
    url = "https://rabbitstream.net/embed-5/{}".format(id)
    print(url)
    headers = {
        "referer": "https://www.2embed.to/",
    }
    params = {
        'id': id.split("?")[0],
        '_number': '1',
        'sId': 'tMK9W5pbb5PYDSCEuuMt',
    }
    resp = get("https://rabbitstream.net/ajax/embed-5/getSources", headers=headers, params=params).json()
    print(resp)


id = get_vidcloud_stream("tt6806448", True)
get_m3u8_rabbitstream(id)
