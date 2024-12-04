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
    public class PlaylistaController : Controller
    {
        private readonly DefaultContext _context;

        public PlaylistaController(DefaultContext context)
        {
            _context = context;
        }

        // GET: Playlista
        public async Task<IActionResult> Index()
        {
            return View(await _context.Playlista.ToListAsync());
        }

        // GET: Playlista/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var playlista = await _context.Playlista
                .FirstOrDefaultAsync(m => m.ID == id);
            if (playlista == null)
            {
                return NotFound();
            }

            return View(playlista);
        }

        // GET: Playlista/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Playlista/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,NAZIV_PLAYLISTE,ZANR,ID_ARANZMANA")] Playlista playlista)
        {
            if (ModelState.IsValid)
            {
                _context.Add(playlista);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(playlista);
        }

        // GET: Playlista/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var playlista = await _context.Playlista.FindAsync(id);
            if (playlista == null)
            {
                return NotFound();
            }
            return View(playlista);
        }

        // POST: Playlista/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,NAZIV_PLAYLISTE,ZANR,ID_ARANZMANA")] Playlista playlista)
        {
            if (id != playlista.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(playlista);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!PlaylistaExists(playlista.ID))
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
            return View(playlista);
        }

        // GET: Playlista/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var playlista = await _context.Playlista
                .FirstOrDefaultAsync(m => m.ID == id);
            if (playlista == null)
            {
                return NotFound();
            }

            return View(playlista);
        }

        // POST: Playlista/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var playlista = await _context.Playlista.FindAsync(id);
            if (playlista != null)
            {
                _context.Playlista.Remove(playlista);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool PlaylistaExists(int id)
        {
            return _context.Playlista.Any(e => e.ID == id);
        }
    }
}
