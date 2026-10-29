// Run with Node and Playwright installed: node tests/learning.cjs
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const root = path.resolve(__dirname, '..');
const server = http.createServer((req, res) => {
  const filename = path.join(root, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  if (!filename.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  fs.readFile(filename, (err, data) => {
    if (err) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', filename.endsWith('.css') ? 'text/css' : filename.endsWith('.js') ? 'text/javascript' : 'text/html');
    res.end(data);
  });
});
(async () => {
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'msedge', headless: true });
  try {
    const page = await browser.newPage({viewport: {width: 1440, height: 1000}, reducedMotion: 'reduce'});
    const errors=[];page.on('pageerror', e=>errors.push(e.message));
    const url='http://127.0.0.1:'+server.address().port;
    await page.goto(url);
    assert.equal(await page.locator('.lesson-item').count(),18);
    assert.equal(await page.locator('.path-card').count(),3);
    // Save, persist, filter, remove; no lesson opens as a side effect.
    await page.locator('[data-save-id="retrieval"]').click();
    await page.reload();
    await page.locator('[data-study-filter="saved"]').click();
    assert.equal(await page.locator('.lesson-item').count(),1);
    await page.locator('.lesson-item .arcana-card').click();
    assert.equal(await page.locator('#lessonTitle').textContent(),'인출 연습');
    await page.locator('#readSummary').click();
    assert.equal(await page.locator('#vnLearning').isVisible(),true);
    assert.equal(await page.locator('#recallPanel').isVisible(),true);
    // Summary does not mark a lesson complete; wrong answer does not either.
    assert.equal(await page.locator('#doneCount').textContent(),'0 / 18');
    await page.locator('#quizOptions button').nth(0).click();
    assert.equal(await page.locator('#doneCount').textContent(),'0 / 18');
    await page.locator('#quizOptions button').nth(1).click();
    assert.equal(await page.locator('#doneCount').textContent(),'1 / 18');
    await page.locator('#backLessons').click();
    await page.locator('[data-save-id="retrieval"]').click();
    assert.equal(await page.locator('.lesson-item').count(),0);
    await page.locator('#clearFilters').click();
    // Search remains intact when changing category and returning from a lesson.
    await page.locator('#topicSearch').fill('후광');
    await page.locator('#categoryTabs [data-category="relations"]').click();
    assert.equal(await page.locator('.lesson-item').count(),1);
    await page.locator('.lesson-item .arcana-card').click();
    await page.locator('#backLessons').click();
    assert.equal(await page.locator('#topicSearch').inputValue(),'후광');
    assert.equal(await page.locator('.lesson-item').count(),1);
    await page.locator('#clearFilters').click();
    // Course order and completion route.
    await page.locator('.path-card').nth(2).locator('button').click();
    assert.equal(await page.locator('#lessonTitle').textContent(),'작업기억');
    await page.locator('#nextLesson').click();
    assert.equal(await page.locator('#lessonTitle').textContent(),'인출 연습');
    await page.locator('#nextLesson').click();
    assert.equal(await page.locator('#lessonTitle').textContent(),'분산 학습');
    await page.locator('#nextLesson').click();
    assert.equal(await page.locator('#homeView').isVisible(),true);
    // Every story renders all choices and the learning/quiz ending.
    const titles=await page.locator('.lesson-item .arcana-card__title').allTextContents();
    for (const title of titles) {
      await page.locator('.lesson-item .arcana-card').filter({has:page.locator('.arcana-card__title',{hasText:title})}).first().click();
      for(let i=0;i<3;i++)await page.locator('#vnNext').click();
      assert.equal(await page.locator('#vnChoices button').count(),3,title);
      await page.locator('#vnChoices button').nth(1).click();
      for(let i=0;i<4;i++)await page.locator('#vnNext').click();
      assert.equal(await page.locator('#vnLearning').isVisible(),true,title);
      assert.equal(await page.locator('#quizOptions button').count(),4,title);
      assert.ok((await page.locator('#noteCore').textContent()).length>10,title);
      await page.locator('#backLessons').click();
    }
    // Existing completion survives the additional lessons.
    await page.reload();assert.equal(await page.locator('#doneCount').textContent(),'1 / 18');
    const out=process.env.SCREENSHOT_DIR;
    if(out){fs.mkdirSync(out,{recursive:true});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:path.join(out,'desktop.png'),fullPage:true});await page.screenshot({path:path.join(out,'desktop-top.png')});}
    for(const width of [390,320]){
      await page.setViewportSize({width,height:844});
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'home width '+width);
      await page.locator('.path-card button').first().click();
      await page.locator('#readSummary').click();
      assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'lesson width '+width);
      if(out&&width===390)await page.screenshot({path:path.join(out,'mobile-lesson.png'),fullPage:true});
      await page.locator('#backLessons').click();
    }
    // Storage failures must not prevent any lesson from opening.
    const blocked=await browser.newPage();blocked.on('pageerror',e=>errors.push(e.message));
    await blocked.addInitScript(()=>{Storage.prototype.setItem=()=>{throw new Error('blocked');};Storage.prototype.getItem=()=>{throw new Error('blocked');};});
    await blocked.goto(url);await blocked.locator('.path-card button').first().click();
    assert.equal(await blocked.locator('#lessonView').isVisible(),true);
    assert.deepEqual(errors,[]);
    console.log('PASS: 18 stories, summary/quiz, courses, bookmarks, persistence, combined filters, 320/390px layouts, blocked storage; no browser errors.');
  } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
