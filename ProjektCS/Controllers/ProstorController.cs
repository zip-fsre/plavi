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
    public class ProstorController : Controller
    {
        private readonly DefaultContext _context;

        public ProstorController(DefaultContext context)
        {
            _context = context;
        }

        // GET: Prostor
        public async Task<IActionResult> Index()
        {
            return View(await _context.Prostor.ToListAsync());
        }

        // GET: Prostor/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prostor = await _context.Prostor
                .FirstOrDefaultAsync(m => m.ID == id);
            if (prostor == null)
            {
                return NotFound();
            }

            return View(prostor);
        }

        // GET: Prostor/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Prostor/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,LOKACIJA,BROJ_STOLOVA,BROJ_MJESTA_PO_STOLU,UKUPAN_KAPACITET,ID_ARANZMANA")] Prostor prostor)
        {
            if (ModelState.IsValid)
            {
                _context.Add(prostor);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(prostor);
        }

        // GET: Prostor/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prostor = await _context.Prostor.FindAsync(id);
            if (prostor == null)
            {
                return NotFound();
            }
            return View(prostor);
        }

        // POST: Prostor/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,LOKACIJA,BROJ_STOLOVA,BROJ_MJESTA_PO_STOLU,UKUPAN_KAPACITET,ID_ARANZMANA")] Prostor prostor)
        {
            if (id != prostor.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(prostor);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!ProstorExists(prostor.ID))
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
            return View(prostor);
        }

        // GET: Prostor/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var prostor = await _context.Prostor
                .FirstOrDefaultAsync(m => m.ID == id);
            if (prostor == null)
            {
                return NotFound();
            }

            return View(prostor);
        }

        // POST: Prostor/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var prostor = await _context.Prostor.FindAsync(id);
            if (prostor != null)
            {
                _context.Prostor.Remove(prostor);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool ProstorExists(int id)
        {
            return _context.Prostor.Any(e => e.ID == id);
        }
    }
}
