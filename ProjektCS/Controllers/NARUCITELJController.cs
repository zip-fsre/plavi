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
    public class NARUCITELJController : Controller
    {
        private readonly DefaultContext _context;

        public NARUCITELJController(DefaultContext context)
        {
            _context = context;
        }

        // GET: NARUCITELJ
        public async Task<IActionResult> Index()
        {
            return View(await _context.NARUCITELJ.ToListAsync());
        }

        // GET: NARUCITELJ/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nARUCITELJ = await _context.NARUCITELJ
                .FirstOrDefaultAsync(m => m.ID == id);
            if (nARUCITELJ == null)
            {
                return NotFound();
            }

            return View(nARUCITELJ);
        }

        // GET: NARUCITELJ/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: NARUCITELJ/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,IME_I_PREZIME,KONTAKT,EMAIL")] NARUCITELJ nARUCITELJ)
        {
            if (ModelState.IsValid)
            {
                _context.Add(nARUCITELJ);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(nARUCITELJ);
        }

        // GET: NARUCITELJ/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nARUCITELJ = await _context.NARUCITELJ.FindAsync(id);
            if (nARUCITELJ == null)
            {
                return NotFound();
            }
            return View(nARUCITELJ);
        }

        // POST: NARUCITELJ/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,IME_I_PREZIME,KONTAKT,EMAIL")] NARUCITELJ nARUCITELJ)
        {
            if (id != nARUCITELJ.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(nARUCITELJ);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!NARUCITELJExists(nARUCITELJ.ID))
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
            return View(nARUCITELJ);
        }

        // GET: NARUCITELJ/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var nARUCITELJ = await _context.NARUCITELJ
                .FirstOrDefaultAsync(m => m.ID == id);
            if (nARUCITELJ == null)
            {
                return NotFound();
            }

            return View(nARUCITELJ);
        }

        // POST: NARUCITELJ/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var nARUCITELJ = await _context.NARUCITELJ.FindAsync(id);
            if (nARUCITELJ != null)
            {
                _context.NARUCITELJ.Remove(nARUCITELJ);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool NARUCITELJExists(int id)
        {
            return _context.NARUCITELJ.Any(e => e.ID == id);
        }
    }
}
