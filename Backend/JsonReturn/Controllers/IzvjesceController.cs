// Controllers/IzvjesceController.cs

using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Mvc;
using JsonReturn.Models;

namespace JsonReturn.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class IzvjesceController : ControllerBase
    {
        private readonly Pi02Context _context;
        public IzvjesceController(Pi02Context context)
        {
            _context = context;
        }

        // GET: api/Izvjesce
        [HttpGet]
        public ActionResult<IEnumerable<JsonReturn.Models.Izvjesce>> GetIzvjesces()
        {
            return _context.Izvjesces.ToList();
        }

        // GET: api/Izvjesce/1
        [HttpGet("{id}")]
        public ActionResult<Izvjesce> GetIzvjesce(int id)
        {
            var Izvjesce = _context.Izvjesces.Find(id);
            if (Izvjesce == null)
            {
                return NotFound();
            }
            return Izvjesce;
        }

        // POST: api/Izvjesce
        [HttpPost]
        public ActionResult<Izvjesce> CreateIzvjesce(Izvjesce Izvjesce)
        {
            if (Izvjesce == null)
            {
                return BadRequest();
            }

            _context.Izvjesces.Add(Izvjesce);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetIzvjesce), new { id = Izvjesce.Id }, Izvjesce);
        }
    }
}