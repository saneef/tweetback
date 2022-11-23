const dataSource = require("../src/DataSource");
const metadata = require("../_data/metadata.js");

module.exports = async function (data) {
	let titleTweetNumberStr = "";
	if (data.page.fileSlug === "tweet-pages") {
		titleTweetNumberStr = `—№ ${this.renderNumber(
			data.pagination.hrefs.length - data.pagination.pageNumber
		)}`;
	} else if (data.page.fileSlug === "newest") {
		titleTweetNumberStr = `—№ ${this.renderNumber(
			(await dataSource.getAllTweets()).length
		)}`;
	}

	let navHtml = "";
	if (data.page.fileSlug === "tweet-pages" || data.page.fileSlug === "newest") {
		let newestHref = "/newest/";
		let previousHref = data.pagination.previousPageHref;
		let nextHref = data.pagination.nextPageHref;

		if (data.page.fileSlug === "newest") {
			newestHref = "";
			previousHref = "";
			nextHref =
				"/" +
				(await dataSource.getAllTweets())
					.sort((a, b) => b.date - a.date)
					.slice(1, 2)
					.map((tweet) => tweet.id_str)
					.join("") +
				"/";
		} else if (
			data.page.fileSlug === "tweet-pages" &&
			data.pagination.firstPageHref === data.page.url
		) {
			newestHref = "";
		}

		navHtml = `<ul class="tweets-nav">
			<li>${
				newestHref ? `<a href="${newestHref}">` : ""
			}⇤ Newest<span class="sr-only"> Tweet</span>${
			newestHref ? `</a>` : ""
		}</li>
			<li>${
				previousHref ? `<a href="${previousHref}">` : ""
			}⇠ Newer<span class="sr-only"> Tweet</span>${
			previousHref ? `</a>` : ""
		}</li>
			<li>${
				nextHref ? `<a href="${nextHref}">` : ""
			}Older<span class="sr-only"> Tweet</span> ⇢${nextHref ? `</a>` : ""}</li>
		</ul>`;
	}

	return `<!doctype html>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>${data.metadata.username}’s Twitter Archive${titleTweetNumberStr}</title>
		<meta name="description" content="A read-only indieweb self-hosted archive of${
			data.pagination && data.pagination.hrefs && data.pagination.hrefs.length
				? ` all ${data.pagination.hrefs.length}`
				: ""
		} of ${data.metadata.username}’s tweets." />
		<script>
		if("classList" in document.documentElement) {
			document.documentElement.classList.add("has-js");
		}
		</script>

		${
			data.page.fileSlug !== "tweet-pages"
				? `
			<link rel="stylesheet" href="/assets/chartist.min.css">
			<link rel="stylesheet" href="/assets/chart.css">
			<script src="/assets/chartist.min.js"></script>
			<script src="/assets/chart.js"></script>
		`
				: ""
		}

		<link rel="stylesheet" href="/assets/style.css">
		<script src="/assets/script.js"></script>
		${
			data.page.fileSlug === "newest"
				? `<link rel="canonical" href="/${data.tweet.id_str}/">
<meta http-equiv="refresh" content="0; url=/${data.tweet.id_str}/">`
				: ""
		}
	</head>
	<body>
		<div class="container">
			<header class="page-header">
				<a class="me-card page-header__brand" href="/">
					<img src="${metadata.avatar}" width="48" height="48"
						alt="${data.metadata.username}’s avatar" class="me-card__avatar">
					<span class="me-card__name">
						<span>${data.metadata.name}</span>
						<span class="me-card__verification">
							<svg class="icon icon--verified" role="img" aria-hidden="true" viewBox="0,0,24,24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
								<path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"/>
							</svg>
						</span>
						<span class="me-card__official" aria-hidden="true">
							<svg class="icon" role="img" aria-hidden="true" viewBox="0 0 24 24" width="24" height="24">
								<path d="M12.5 23h-.7c-.2 0-.3 0-.5-.1-1.1-.2-2-.8-2.7-1.7 0-.1-.1-.1-.2-.1-.7.2-1.4.1-2.1-.1-1.3-.5-2.3-1.3-2.8-2.7-.3-.8-.4-1.6-.2-2.4 0-.1 0-.1-.1-.1-.2-.1-.4-.3-.5-.4-1.1-1.1-1.5-2.5-1.2-4 .2-1.1.8-2.1 1.7-2.8.1 0 .1-.1.1-.1-.1-.6-.1-1.3 0-1.9.6-2.3 2.8-3.8 5.1-3.4.1 0 .1 0 .1-.1 1.1-1.4 2.6-2 4.3-1.7 1.2.2 2.1.8 2.9 1.7 0 .1.1.1.1.1 1-.2 1.9 0 2.7.4 1.8.9 2.8 2.8 2.5 4.8 0 .1 0 .2.1.2.9.7 1.5 1.6 1.7 2.8 0 .2 0 .3.1.5v.8c-.2 1.3-.8 2.4-1.8 3.1-.1 0-.1.1-.1.1.1.5.1.9 0 1.4-.2 1.3-.8 2.3-1.9 3.1-.7.5-1.4.7-2.2.8-.4 0-.7 0-1.1-.1-.1 0-.1 0-.2.1-.2.2-.4.5-.6.7-.6.6-1.4.9-2.2 1 0 .1-.2.1-.3.1zM7.7 5c-.8 0-1.5.3-2 .9-.6.6-.8 1.4-.7 2.2.1.4.1.8.2 1.1 0 .1 0 .1-.1.2-.2.2-.5.4-.8.6-.7.5-1.1 1.2-1.1 2 0 .9.3 1.7 1.1 2.3.3.2.6.4.9.7.1 0 .1.1.1.1-.1.3-.1.5-.2.8-.1.5-.1 1 0 1.5.4 1.3 1.7 2.1 3 1.9.4-.1.8-.1 1.2-.2h.1c.2.3.4.6.6.8.5.7 1.1 1.1 2 1.2.9.1 1.6-.2 2.2-.9.3-.3.5-.7.8-1.1 0-.1.1-.1.2-.1.3.1.6.1 1 .2.8.2 1.6 0 2.3-.5.8-.6 1.1-1.5 1-2.5-.1-.4-.1-.7-.2-1.1 0-.1 0-.1.1-.2.4-.3.7-.5 1.1-.8 1.2-1 1.2-3 0-4-.3-.3-.7-.5-1.1-.8-.1 0-.1-.1-.1-.1.1-.3.1-.5.2-.8.1-.4.1-.9 0-1.3-.3-1.4-1.6-2.4-3-2.1-.4.1-.8.1-1.1.2-.1 0-.1 0-.2-.1-.2-.3-.4-.7-.7-1-.7-.8-1.6-1.2-2.6-1-.9.3-1.5.7-1.9 1.3-.2.2-.4.5-.6.8 0 0-.1.1-.1 0-.2 0-.4-.1-.5-.1-.4 0-.7-.1-1.1-.1z"/><path d="m15.4 9.5 1.3 1.3-5.4 5.4-3.6-3.6L9 11.3l2.3 2.3 4.1-4.1z"/></svg>
								 Official
						</span>
					</span>
				</a>
				<div class="page-header__nav">
					${
						!data.hideHeaderTweetsLink
							? `<ul class="tweets-nav">
						<li><a href="${data.metadata.homeUrl}">← ${data.metadata.homeLabel}</a></li>
					</ul>`
							: ""
					}
				</div>
				${navHtml}
			</header>
			<main>
				${data.content}
			</main>
			<footer>
				<p>An open source project from <a href="https://github.com/tweetback">tweetback</a>.</p>
			</footer>
		</div>
	</body>
</html>`;
};
