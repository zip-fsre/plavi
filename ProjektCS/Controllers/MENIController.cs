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
    public class MENIController : Controller
    {
        private readonly DefaultContext _context;

        public MENIController(DefaultContext context)
        {
            _context = context;
        }

        // GET: MENI
        public async Task<IActionResult> Index()
        {
            return View(await _context.MENI.ToListAsync());
        }

        // GET: MENI/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mENI = await _context.MENI
                .FirstOrDefaultAsync(m => m.ID == id);
            if (mENI == null)
            {
                return NotFound();
            }

            return View(mENI);
        }

        // GET: MENI/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: MENI/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("ID,NAZIV_MENIJA,ID_ARANZMANA")] MENI mENI)
        {
            if (ModelState.IsValid)
            {
                _context.Add(mENI);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(mENI);
        }

        // GET: MENI/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mENI = await _context.MENI.FindAsync(id);
            if (mENI == null)
            {
                return NotFound();
            }
            return View(mENI);
        }

        // POST: MENI/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("ID,NAZIV_MENIJA,ID_ARANZMANA")] MENI mENI)
        {
            if (id != mENI.ID)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(mENI);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!MENIExists(mENI.ID))
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
            return View(mENI);
        }

        // GET: MENI/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var mENI = await _context.MENI
                .FirstOrDefaultAsync(m => m.ID == id);
            if (mENI == null)
            {
                return NotFound();
            }

            return View(mENI);
        }

        // POST: MENI/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var mENI = await _context.MENI.FindAsync(id);
            if (mENI != null)
            {
                _context.MENI.Remove(mENI);
            }

            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool MENIExists(int id)
        {
            return _context.MENI.Any(e => e.ID == id);
        }
    }
}
