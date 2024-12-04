using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using ProjektCS.Data;
using ProjektCS.Models;

namespace ProjektCS.Controllers
{
    public class PartneriController : Controller
    {
        private readonly DefaultContext _context;

        public PartneriController(DefaultContext context)
        {
            _context = context;
        }

        // GET: Partneri
        public async Task<IActionResult> Index()
        {
            return View(await _context.Partneri.ToListAsync());
        }

        // GET: Partneri/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var partneri = await _context.Partneri
                .FirstOrDefaultAsync(m => m.ID == id);
            if (partneri == null)
            {
                return NotFound();
            }

            return View(partneri);
        }

        // GET: Partneri/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Partneri/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,NAZIV,KONTAKT,EMAIL,TIP")] Partneri partneri)
        {
            if (ModelState.IsValid)
            {
                _context.Add(partneri);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(partneri);
        }

        // GET: Partneri/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var partneri = await _context.Partneri.FindAsync(id);
            if (partneri == null)
            {
                return NotFound();
            }
            return View(partneri);
        }

        // POST: Partneri/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,NAZIV,KONTAKT,EMAIL,TIP")] Partneri partneri)
        {
            if (id != partneri.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(partneri);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PartneriExists(partneri.ID))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(partneri);
        }

        // GET: Partneri/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var partneri = await _context.Partneri
                .FirstOrDefaultAsync(m => m.ID == id);
            if (partneri == null)
            {
                return NotFound();
            }

            return View(partneri);
        }

        // POST: Partneri/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var partneri = await _context.Partneri.FindAsync(id);
            if (partneri != null)
            {
                _context.Partneri.Remove(partneri);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PartneriExists(int id)
        {
            return _context.Partneri.Any(e => e.ID == id);
        }
    }
}
