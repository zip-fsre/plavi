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
    public class GostController : Controller
    {
        private readonly DefaultContext _context;

        public GostController(DefaultContext context)
        {
            _context = context;
        }

        // GET: Gost
        public async Task<IActionResult> Index()
        {
            return View(await _context.Gost.ToListAsync());
        }

        // GET: Gost/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gost = await _context.Gost
                .FirstOrDefaultAsync(m => m.ID == id);
            if (gost == null)
            {
                return NotFound();
            }

            return View(gost);
        }

        // GET: Gost/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: Gost/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,ID_DOGADJAJA,IME_I_PREZIME,BROJ_STOLA,STATUS_GOSTA,STATUS_DOLASKA")] Gost gost)
        {
            if (ModelState.IsValid)
            {
                _context.Add(gost);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(gost);
        }

        // GET: Gost/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gost = await _context.Gost.FindAsync(id);
            if (gost == null)
            {
                return NotFound();
            }
            return View(gost);
        }

        // POST: Gost/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,ID_DOGADJAJA,IME_I_PREZIME,BROJ_STOLA,STATUS_GOSTA,STATUS_DOLASKA")] Gost gost)
        {
            if (id != gost.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(gost);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!GostExists(gost.ID))
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
            return View(gost);
        }

        // GET: Gost/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var gost = await _context.Gost
                .FirstOrDefaultAsync(m => m.ID == id);
            if (gost == null)
            {
                return NotFound();
            }

            return View(gost);
        }

        // POST: Gost/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var gost = await _context.Gost.FindAsync(id);
            if (gost != null)
            {
                _context.Gost.Remove(gost);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool GostExists(int id)
        {
            return _context.Gost.Any(e => e.ID == id);
        }
    }
}
