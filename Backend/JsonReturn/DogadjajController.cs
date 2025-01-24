/* using Microsoft.AspNetCore.Mvc;

namespace JsonReturn
{
    [ApiController]
    [Route("[controller]")]
    public class DogadjajController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<DogadjajController> _logger;

        public DogadjajController(ILogger<DogadjajController> logger)
        {
            _logger = logger;
        }

        [HttpGet(Name = "GetDogadjaj")]
        public IEnumerable<Dogadjaj> Get()
        {
            return Enumerable.Range(1, 2).Select(index => new Dogadjaj
            {
                ID = index,
                LOKACIJA = "Ovdje",
                DATUM = DateTime.Now,
                SVRHA = "VJENCANJE",
                IME_ORGANIZATORA = "Drakula",
                KONTAKT_ORGANIZATORA = "063123321",
                BROJ_GOSTIJU = 15
            })
            .ToArray();
        }
    }
}

/* public int ID { get; set; }
        public string? NAZIV { get; set; }
        public DateTime? DATUM { get; set; }
        public string? LOKACIJA { get; set; }
        public string? SVRHA { get; set; }
        public string? IME_ORGANIZATORA { get; set; }
        public string? KONTAKT_ORGANIZATORA { get; set; }
        public int? BROJ_GOSTIJU { get; set; } */