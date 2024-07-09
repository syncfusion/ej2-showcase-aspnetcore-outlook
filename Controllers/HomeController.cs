using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace EJ2CoreSampleBrowser.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Home()
        {
            return PartialView("home");
        }
        public IActionResult NewMail()
        {
            return PartialView("newmail");
        }
        public ActionResult Readingpane()
        {
            return PartialView("readingpane");
        }
    }
}