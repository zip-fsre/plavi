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
    public class DOGADJAJsController : Controller
    {
        private readonly DefaultContext _context;

        public DOGADJAJsController(DefaultContext context)
        {
            _context = context;
        }

        // GET: DOGADJAJs
        public async Task<IActionResult> Index()
        {
            return View(await _context.DOGADJAJ.ToListAsync());
        }

        // GET: DOGADJAJs/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dOGADJAJ = await _context.DOGADJAJ
                .FirstOrDefaultAsync(m => m.ID == id);
            if (dOGADJAJ == null)
            {
                return NotFound();
            }

            return View(dOGADJAJ);
        }

        // GET: DOGADJAJs/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: DOGADJAJs/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,NAZIV,DATUM,LOKACIJA,SVRHA,IME_ORGANIZATORA,KONTAKT_ORGANIZATORA,BROJ_GOSTIJU")] DOGADJAJ dOGADJAJ)
        {
            if (ModelState.IsValid)
            {
                _context.Add(dOGADJAJ);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(dOGADJAJ);
        }

        // GET: DOGADJAJs/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dOGADJAJ = await _context.DOGADJAJ.FindAsync(id);
            if (dOGADJAJ == null)
            {
                return NotFound();
            }
            return View(dOGADJAJ);
        }

        // POST: DOGADJAJs/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,NAZIV,DATUM,LOKACIJA,SVRHA,IME_ORGANIZATORA,KONTAKT_ORGANIZATORA,BROJ_GOSTIJU")] DOGADJAJ dOGADJAJ)
        {
            if (id != dOGADJAJ.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(dOGADJAJ);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!DOGADJAJExists(dOGADJAJ.ID))
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
            return View(dOGADJAJ);
        }

        // GET: DOGADJAJs/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var dOGADJAJ = await _context.DOGADJAJ
                .FirstOrDefaultAsync(m => m.ID == id);
            if (dOGADJAJ == null)
            {
                return NotFound();
            }

            return View(dOGADJAJ);
        }

        // POST: DOGADJAJs/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var dOGADJAJ = await _context.DOGADJAJ.FindAsync(id);
            if (dOGADJAJ != null)
            {
                _context.DOGADJAJ.Remove(dOGADJAJ);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool DOGADJAJExists(int id)
        {
            return _context.DOGADJAJ.Any(e => e.ID == id);
        }
    }
}
