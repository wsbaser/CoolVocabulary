using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Threading.Tasks;
using System.Net;
using System.Web;
using System.Web.Mvc;
using CoolVocabulary.Models;

namespace CoolVocabulary.Controllers
{
    public class WordController : Controller
    {
        private VocabularyDbContext db = new VocabularyDbContext();

        // GET: /Word/
        public async Task<ActionResult> Index()
        {
            return View(await db.Words.ToListAsync());
        }

        // GET: /Word/Details/5
        public async Task<ActionResult> Details(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Word word = await db.Words.FindAsync(id);
            if (word == null)
            {
                return HttpNotFound();
            }
            return View(word);
        }

        // GET: /Word/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: /Word/Create
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Create([Bind(Include="ID,Language,Value,Pronunsiation,SoundUrls,PictureUrls")] Word word)
        {
            if (ModelState.IsValid)
            {
                db.Words.Add(word);
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }

            return View(word);
        }

        // GET: /Word/Edit/5
        public async Task<ActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Word word = await db.Words.FindAsync(id);
            if (word == null)
            {
                return HttpNotFound();
            }
            return View(word);
        }

        // POST: /Word/Edit/5
        // Чтобы защититься от атак чрезмерной передачи данных, включите определенные свойства, для которых следует установить привязку. Дополнительные 
        // сведения см. в статье http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> Edit([Bind(Include="ID,Language,Value,Pronunsiation,SoundUrls,PictureUrls")] Word word)
        {
            if (ModelState.IsValid)
            {
                db.Entry(word).State = EntityState.Modified;
                await db.SaveChangesAsync();
                return RedirectToAction("Index");
            }
            return View(word);
        }

        // GET: /Word/Delete/5
        public async Task<ActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return new HttpStatusCodeResult(HttpStatusCode.BadRequest);
            }
            Word word = await db.Words.FindAsync(id);
            if (word == null)
            {
                return HttpNotFound();
            }
            return View(word);
        }

        // POST: /Word/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> DeleteConfirmed(int id)
        {
            Word word = await db.Words.FindAsync(id);
            db.Words.Remove(word);
            await db.SaveChangesAsync();
            return RedirectToAction("Index");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }
    }
}
